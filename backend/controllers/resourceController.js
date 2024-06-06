const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const validator = require('validator');
const Resource = require('../models/createResourceModel');
const { error } = require('console');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const CreateResource = async (req, res) => {
    const { resourceName, uploaderName, description, category, permalink, skills, security_key, phone } = req.body;
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
      if (security_key !== process.env.SECURITY_KEY) {
        throw new Error('Security key incorrect!');
      }
  
      // Check phone number
      if (!validator.isMobilePhone(phone)) {
        throw new Error('Phone number not valid!');
      }
  
      if (!security_key) {
        flag = false;
        message = 'Resource created and waiting for approval!';
      } else {
        flag = true;
        message = 'Resource created!';
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
  
      const pdfResult = await uploadToCloudinary(pdfFile, 'pdfs');
      const imageResult = await uploadToCloudinary(imageFile, 'images');
  
      // Create resource
      await Resource.create({
        pdfPoster: imageResult.secure_url,
        pdf: pdfResult.secure_url,
        resourceName,
        uploaderName,
        description,
        category,
        permalink,
        skills,
        phone,
        accepted: flag,
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
        res.status(400).json({error: 'No resource found'});
    }
}

module.exports = { CreateResource, getAcceptedResoures, getPendingResources };


