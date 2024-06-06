require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const createResource = require('./routes/resourceRoute');

//express app
const app = express();

//cors
const allowedOrigins = [
    "http://localhost:3000", 

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

//database connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    //listening to port
    app.listen(process.env.PORT, () => {
        console.log('Listening for requests on PORT', process.env.PORT)
    })
})
.catch((err) => {
    console.log('server encountered an error', err)
})