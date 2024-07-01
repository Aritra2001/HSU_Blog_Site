const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const Project = require('../models/createProject');

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

  if(status === 'Approve') {
    await Project.findByIdAndUpdate({ _id: id}, { accepted: true });
    res.status(200).json({message: 'Project approved'});
  }
  else {
    const project = await Project.findById({ _id: id });
    deleteFromCloudinary(project.projectPosterPublicId);
    deleteFromCloudinary(project.pdfPublicId);
    await Project.findByIdAndDelete({ _id: id });
    res.status(200).json({message: 'Project deleted successfully'});
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

module.exports = { CreateProject, getAcceptedProjects, getPendingProjects, categoryFilter, getProject, updateProject, addLikes, getpopularProjects };