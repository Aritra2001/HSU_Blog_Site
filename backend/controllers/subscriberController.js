const Subscribe = require('../models/subscriberModel');
const validator = require('validator');

const subscribe = async (req, res) => {
    const {email} = req.body;

    try {

        if(!validator.isEmail(email)) {
            throw Error('Email invalid!');
        }

        const mail = await Subscribe.findOne({email});

        if(mail) {
            throw Error('Email already exits!')
        }

        await Subscribe.create({email});
        res.status(200).json({message: 'Subscribed Successfully!'});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = { subscribe };