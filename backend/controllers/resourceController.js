const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const Resource = require('../models/createResourceModel');
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

var img_link = 'https://hexstaruniverse.com/wp-content/uploads/Group-48095413-8.png';


// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});


const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log(result);
    if (result.result === 'ok') {
      return { success: true, message: 'File deleted successfully' };
    } else {
      return { success: false, message: 'Failed to delete file' };
    }
  } catch (error) {
    console.error(error);
    return { success: false, message: 'An error occurred while deleting the file' };
  }
};

const CreateResource = async (req, res) => {
    const { resourceName, uploaderName, description, category, permalink, skills, security_key, phone, Type, email } = req.body;
    let flag;
    let message;
  
    try {
      const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
      const imageFile = req.files['image'] ? req.files['image'][0] : null;
  
      if (!pdfFile) {
        throw new Error('Pdf file not found!');
      }
  
      if (!imageFile) {
        throw new Error('Image file not found!');
      }
  
      // Check for existing resource name and permalink
      const resname = await Resource.findOne({ resourceName });
      if (resname) {
        throw new Error('Resource name already exists!');
      }
  
      const link = await Resource.findOne({ permalink });
      if (link) {
        throw new Error('Permalink already exists!');
      }
  
      // Check security key
      if (security_key === '') {
        flag = false;
        message = 'Resource created and waiting for approval!';
      } 
      else if (security_key !== process.env.SECURITY_KEY) {
        throw new Error('Security key incorrect!');
      }
      else {
        flag = true;
        message = 'Resource created!';
      }
  
      // Check phone number
      if (!validator.isMobilePhone(phone)) {
        throw new Error('Phone number not valid!');
      }

      if(!validator.isEmail(email)) {
        throw new Error('Email not valid!')
      }

  
      // Upload files to Cloudinary
      const uploadToCloudinary = async (file, folder) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
      };
  
      const pdfResult = await uploadToCloudinary(pdfFile, 'pdf');
      const imageResult = await uploadToCloudinary(imageFile, 'image');
  
      // Create resource
      await Resource.create({
        pdfPoster: imageResult.secure_url,
        pdfPosterPubclidId: imageResult.public_id,
        pdf: pdfResult.secure_url,
        pdfPubclidId: pdfResult.public_id,
        resourceName,
        uploaderName,
        description,
        category,
        permalink,
        skills,
        phone,
        accepted: flag,
        Type,
        email,
        likes: 0
      });
  
      res.status(200).json({ message });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const getAcceptedResoures = async (req, res) => {
    const resources = await Resource.find({ accepted: true });
    
    if(resources){
        res.status(200).json(resources);
    }
    else {
        res.status(400).json({error: 'No resource found'});
    }
}

const getPendingResources = async (req, res) => {
    const resources = await Resource.find({ accepted: false });
    
    if(resources){
        res.status(200).json(resources);
    }
    else {
        res.status(200).json({message: 'No resource found!'});
    }
}

const categoryFilter = async (req, res) => {

   const { category } = req.body;
   const resource = await Resource.find({ category }); 

   if(resource) {
    res.status(200).json(resource);
   }
   else {
    res.status(200).json(({message: 'No resource found for this category!'}))
   }
}

const getResouce = async (req, res) => {
  const { id } = req.params;

  const resource = await Resource.findById({ _id: id });

  if(!resource) {
    res.status(400).json({error: 'Resouce not found'});
  }
  else {
    res.status(200).json({resource});
  }

}

const updateResource = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {

    const search = await Resource.findById({ _id: id });

    if(!search) {
      throw Error('Resource not found!');
    }

    if(status === 'Approve') {
      const resourse = await Resource.findByIdAndUpdate({ _id: id}, { accepted: true });
      
      // accepted mail send
      await resend.emails.send({
        from: 'network@hexstaruniverse.com',
        to: resourse.email,
        subject: 'Submission Status Update',
        html: `
        <html>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet">
            <head>
                 <body style="font-family: 'Poppins', sans-serif; font-size: 16px;">
                <div>
                <table style="width: 69.9834%;" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                <tbody>
                <tr>
                <td style="width: 100%;">
                <a href="https://www.hexstaruniverse.com"><span><img src="${img_link}" alt="Hex-Star Universe" style="width: 120px; height: auto;"></span></a>
                <p><span>Hi <b>${resourse.uploaderName}</b>, Congratulations!</span></p>
                <p>Your submission has been approved. View your submission here 👉🏻 <a href='https://www.hexstaruniverse.com'> Click here</a>.</P>
                <p>Thanks & Regards, <br>Team Hex-Star Universe</p>
                </td>
                </tr>
                </tbody>
                </table>
                </div>
                </body>
            </head>
        </html>
        `
      });
       res.status(200).json({message: 'Resource approved'});
    }
    else {
      const resource = await Resource.findById({ _id: id });
      deleteFromCloudinary(resource.pdfPubclidId);
      deleteFromCloudinary(resource.pdfPosterPubclidId);
      await Resource.findByIdAndDelete({ _id : id });
  
      //declined mail send
      await resend.emails.send({
        from: 'network@hexstaruniverse.com',
        to: resource.email,
        subject: 'Submission Status Update',
        html: `
        <html>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300&display=swap" rel="stylesheet">
            <head>
                 <body style="font-family: 'Poppins', sans-serif; font-size: 16px;">
                <div>
                <table style="width: 69.9834%;" role="presentation" border="0" width="100%" cellspacing="0" cellpadding="0" align="center">
                <tbody>
                <tr>
                <td style="width: 100%;">
                <a href="https://www.hexstaruniverse.com"><span><img src="${img_link}" alt="Hex-Star Universe" style="width: 120px; height: auto;"></span></a>
                <p><span>Hi <b>${resource.uploaderName}</b></span></p>
                <p>Thank you for your submission. Unfortunately, your submission didn't meet the requirements.</P>
                <p>Thanks & Regards, <br>Team Hex-Star Universe</p>
                </td>
                </tr>
                </tbody>
                </table>
                </div>
                </body>
            </head>
        </html>
        `
      });
      res.status(200).json({message: 'Resource deleted successfully'});
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

const addLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await Resource.findOne({ _id: id });

    if (!resource) {
      return res.status(404).send({ error: 'Resource not found' });
    }

    resource.likes += 1;  // Increment likes by 1

    await resource.save();  // Save the updated document

    res.send({message: 'Resource Liked'});  // Send back the updated audiobook document
  } catch (error) {
    res.status(400).send({ error: 'An error occurred' });
  }
};

const getpopularResources = async (req, res) => {

  const resources = await Resource.find({ likes: { $gte: 30 } });

  if(resources) {
    res.status(200).json(resources);
  }
}

const searchResources = async (req, res) => {

  const { resourceName }  = req.body;
  const regex = new RegExp( resourceName, 'i');

  try {
    const resources = await Resource.find({ resourceName: { $regex: regex }}).sort({ createdAt: -1 });

    res.status(200).json(resources);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { CreateResource, getAcceptedResoures, getPendingResources, categoryFilter, getResouce, updateResource, addLikes, getpopularResources, searchResources };


