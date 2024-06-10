const cloudinary = require('cloudinary').v2;
const validator = require('validator');
const AudioBook = require('../models/createAudioBook');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const createAudioBook = async (req, res) => {
  const { AudioBookName, AuthorName, description, category, permalink, skills, security_key, phone, Type, email } = req.body;

  try {
    const audioFile = req.files['audio'] ? req.files['audio'][0] : null;
    const imageFile = req.files['image'] ? req.files['image'][0] : null;

    if (!audioFile) {
      throw new Error('Audio file not found!');
    }

    if (!imageFile) {
      throw new Error('Image file not found!');
    }

    // Debug: Log file types
    console.log('Audio file type:', audioFile.mimetype);
    console.log('Image file type:', imageFile.mimetype);

    const ad_book = await AudioBook.findOne({ AudioBookName });
    if (ad_book) {
      throw new Error('AudioBook already exists!');
    }

    const link = await AudioBook.findOne({ permalink });
    if (link) {
      throw new Error('Permalink already exists!');
    }

    if(security_key !== process.env.SECURITY_KEY) {
        throw new Error('Security key incorrect!');
    }

    if(!security_key) {
      throw Error('Enter security key!')
    }

    if (!validator.isMobilePhone(phone)) {
      throw new Error('Phone number not valid!');
    }

    if (!validator.isEmail(email)) {
      throw new Error('Email not valid!');
    }

    // Upload files to Cloudinary
    const uploadToCloudinary = async (file, folder) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder, resource_type: 'auto' }, // Use 'auto' to let Cloudinary detect file type
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    };

    const audioResult = await uploadToCloudinary(audioFile, 'audio');
    const imageResult = await uploadToCloudinary(imageFile, 'image');

    await AudioBook.create({
      audioBookPoster: imageResult.secure_url,
      audioBookPosterPublicId: imageResult.public_id,
      audio: audioResult.secure_url,
      audioPublicId: audioResult.public_id,
      AudioBookName,
      AuthorName,
      description,
      category,
      permalink,
      skills,
      phone,
      Type,
      email
    });

    res.status(200).json({
      message: 'AudioBook created successfully'
    });

  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(400).json({ error: error.message });
  }
};

const categoryFilter = async (req, res) => {

  const { category } = req.body;
  const audiobook = await AudioBook.find({ category }); 

  if(audiobook) {
   res.status(200).json(audiobook);
  }
  else {
   res.status(200).json(({message: 'No resource found for this category!'}))
  }
}

const getAudioBooks = async (req, res) => {

  const audiobooks = await AudioBook.find({}).sort({ createdAt: -1 });

  if(!audiobooks) {
    res.status(400).json({error: 'No audiobooks found'});
  }
  else {
    res.status(200).json(audiobooks);
  }
}

const getAudioBook = async (req, res) => {
  const { id } = req.params;

  const audiobook = await AudioBook.findById({ _id: id });

  if(!audiobook) {
    res.status(400).json({error: 'Audiobook not found'});
  }
  else {
    res.status(200).json({audiobook});
  }

}

module.exports = { createAudioBook, categoryFilter, getAudioBooks, getAudioBook };
