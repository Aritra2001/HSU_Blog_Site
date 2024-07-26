require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createResource = require('./routes/resourceRoute');
const createAudioBook = require('./routes/audiobookRoutes');
const createProject = require('./routes/projectRoutes');


//express app
const app = express();

//cors
const allowedOrigins = [
    "http://localhost:3001", "https://hsu-blog-site-frontend.vercel.app", "https://skillquest.hexstaruniverse.com"

];

app.use(cors({
    origin:function(origin,callback){
        if(allowedOrigins.indexOf(origin)!== -1 || !origin){
            callback(null,true);
        }
        else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials:true,
}));

app.use(express.json())

app.use((req, res, next) => {
    console.log(req.method, req.url)
    next()
})

//routes
app.use('/api', createResource);
app.use('/api', createAudioBook);
app.use('/api', createProject);


//database connection
mongoose.connect("mongodb+srv://hsudatabase:hsudatabase123@cluster0.vbb9rz3.mongodb.net/")
.then(() => {
    //listening to port
    app.listen(process.env.PORT, () => {
        console.log('Listening for requests on PORT', process.env.PORT)
    })
})
.catch((err) => {
    console.log('server encountered an error', err)
})