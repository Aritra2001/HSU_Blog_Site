const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const Resource = require('../models/createResourceModel');

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
        email
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

  if(status === 'Approve') {
    await Resource.findByIdAndUpdate({ _id: id}, { accepted: true });
    res.status(200).json({message: 'Resource approved'});
  }
  else {
    const resource = await Resource.findById({ _id: id });
    deleteFromCloudinary(resource.pdfPubclidId);
    deleteFromCloudinary(resource.pdfPosterPubclidId);
    await Resource.findByIdAndDelete({ _id: id });
    res.status(200).json({message: 'Resource deleted successfully'});
  }
}

module.exports = { CreateResource, getAcceptedResoures, getPendingResources, categoryFilter, getResouce, updateResource };


