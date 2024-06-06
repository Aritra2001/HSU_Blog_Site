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
    var flag;
    var message;

    try {
        // Initial validations
        const pdfFile = req.files['pdf'] ? req.files['pdf'][0] : null;
        const imageFile = req.files['image'] ? req.files['image'][0] : null;

        if (!pdfFile) {
            throw new Error('Pdf file not found!');
        }

        if (!imageFile) {
            throw new Error('Image file not found!');
        }

        const resname = await Resource.findOne({ resourceName });
        if (resname) {
            throw new Error('Resource name already exists!');
        }

        const link = await Resource.findOne({ permalink });
        if (link) {
            throw new Error('Permalink already exists!');
        }

        if (security_key === ''){
            console.log(flag)
            message = 'Resource created and waiting for approval!';
        }
        else if(security_key !== process.env.SECURITY_KEY) {
            throw new Error('Security key incorrect!');
        }
        else {
            flag = true;
            message = 'Resource created!';
        }

        if (!validator.isMobilePhone(phone)) {
            throw new Error('Phone number not valid!');
        }

        // Upload files to Cloudinary
        const uploadedFiles = {};
        
        const pdfPath = pdfFile.path;
        const pdfResult = await cloudinary.uploader.upload(pdfPath, {
            resource_type: 'raw',
            folder: 'pdfs',
            format: 'pdf',
            public_id: path.basename(pdfPath, path.extname(pdfPath))
        });
        uploadedFiles.pdfUrl = pdfResult.secure_url;
        // Delete local file after upload
        fs.unlinkSync(pdfPath);
        
        const imagePath = imageFile.path;
        const imageResult = await cloudinary.uploader.upload(imagePath, {
            resource_type: 'image',
            folder: 'images',
            format: 'png', // Adjust format as needed
            public_id: path.basename(imagePath, path.extname(imagePath))
        });
        uploadedFiles.imageUrl = imageResult.secure_url;
        // Delete local file after upload
        fs.unlinkSync(imagePath);

        // Create the resource with the uploaded file URLs
        await Resource.create({
            pdfPoster: uploadedFiles.imageUrl,
            pdf: uploadedFiles.pdfUrl,
            resourceName,
            uploaderName,
            description,
            category,
            permalink,
            skills,
            phone,
            accepted: flag
        });

        res.status(200).json({ message: message });

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


