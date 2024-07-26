const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const Project = require('../models/createProject');
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

const CreateProject = async (req, res) => {
    const { ProjectName, AuthorName, abstract, category, permalink, skills, security_key, phone, Type, email, project_vision, mission_statement, team_size, status } = req.body;
    let flag;
    let message;
  
    try {
      const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
      const imageFile = req.files['image'] ? req.files['image'][0] : null;
  
      if (!pdfFile) {
        throw new Error('Document file not found!');
      }
  
      if (!imageFile) {
        throw new Error('Image file not found!');
      }
  
      // Check for existing resource name and permalink
      const pname = await Project.findOne({ ProjectName });
      if (pname) {
        throw new Error('Project name already exists!');
      }
  
      const link = await Project.findOne({ permalink });
      if (link) {
        throw new Error('Permalink already exists!');
      }
  
      // Check security key
      if (security_key === '') {
        flag = false;
        message = 'Project added and waiting for approval!';
      } 
      else if (security_key !== process.env.SECURITY_KEY) {
        throw new Error('Security key incorrect!');
      }
      else {
        flag = true;
        message = 'Project added successfully!';
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
            { folder, resource_type: 'auto' }, // Use 'raw' for documents
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
      await Project.create({
        projectPoster: imageResult.secure_url,
        projectPosterPublicId: imageResult.public_id,
        pdf: pdfResult.secure_url,
        pdfPublicId: pdfResult.public_id,
        ProjectName,
        AuthorName,
        abstract,
        category,
        permalink,
        skills,
        phone,
        accepted: flag,
        Type,
        email,
        mission_statement,
        project_vision,
        team_size,
        status,
        likes: 0
      });
  
      res.status(200).json({ message });
  
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

const getAcceptedProjects = async (req, res) => {
    const projects = await Project.find({ accepted: true });
    
    if(projects){
        res.status(200).json(projects);
    }
    else {
        res.status(400).json({error: 'No projects found'});
    }
}

const getPendingProjects = async (req, res) => {
    const projects = await Project.find({ accepted: false });
    
    if(projects){
        res.status(200).json(projects);
    }
    else {
        res.status(200).json({message: 'No projects found!'});
    }
}

const categoryFilter = async (req, res) => {

   const { category } = req.body;
   const project = await Project.find({ category }); 

   if(project) {
    res.status(200).json(project);
   }
   else {
    res.status(200).json(({message: 'No project found for this category!'}))
   }
}

const getProject = async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById({ _id: id });

  if(!project) {
    res.status(400).json({error: 'Project not found'});
  }
  else {
    res.status(200).json({project});
  }

}

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const search = await Project.findById({ _id : id});

    if(!search) {
      throw Error('Project not found!');
    }

    if(status === 'Approve') {
      const project = await Project.findByIdAndUpdate({ _id: id}, { accepted: true });
  
      //approve mail send
      await resend.emails.send({
        from: 'network@hexstaruniverse.com',
        to: project.email,
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
                <p><span>Hi <b>${project.AuthorName}</b>, Congratulations!</span></p>
                <p>Your submission has been approved. View your submission here 👉🏻 <a href='https://skillquest.hexstaruniverse.com/viewProject/${id}'> Click here</a>.</P>
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
      res.status(200).json({message: 'Project approved'});
    }
    else {
      const project = await Project.findById({ _id: id });
      deleteFromCloudinary(project.projectPosterPublicId);
      deleteFromCloudinary(project.pdfPublicId);
      await Project.findByIdAndDelete({ _id: id });

      //declined mail send
      await resend.emails.send({
        from: 'network@hexstaruniverse.com',
        to: project.email,
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
                <p><span>Hi <b>${project.AuthorName}</b></span></p>
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
      res.status(200).json({message: 'Project deleted successfully'});
    }
  } catch (error) {
    res.status(400).json({error: error.message});
  }
}

const addLikes = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findOne({ _id: id });

    if (!project) {
      return res.status(404).send({ error: 'Project not found' });
    }

    project.likes += 1;  // Increment likes by 1

    await project.save();  // Save the updated document

    res.send({message: 'Project Liked'});  // Send back the updated audiobook document
  } catch (error) {
    res.status(500).send({ error: 'An error occurred' });
  }
};

const getpopularProjects = async (req, res) => {

  const projects = await Project.find({ likes: { $gte: 30 } });

  if(projects) {
    res.status(200).json(projects)
  }
}

const searchProjects = async (req, res) => {

  const { ProjectName }  = req.body;
  const regex = new RegExp( ProjectName, 'i');

  try {
    const projects = await Project.find({ ProjectName: { $regex: regex }, accepted: true}).sort({ createdAt: -1 });

    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { CreateProject, getAcceptedProjects, getPendingProjects, categoryFilter, getProject, updateProject, addLikes, getpopularProjects, searchProjects };