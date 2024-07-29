const Queue = require('bull');
require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
var img_link = 'https://hexstaruniverse.com/wp-content/uploads/Group-48095413-8.png';

const redis_url = process.env.REDIS_URL;

const emailQueue = new Queue('emailQueue', redis_url);

emailQueue.process(async (job) => {

    const { email, audiobook } = job.data;
    console.log(audiobook.AudioBookName, audiobook._id);

    await resend.emails.send({
        from: 'network@hexstaruniverse.com',
        to: email,
        subject: 'New Audiobook uploaded',
        html: 
        `<html>
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
        <p>A new audiobook titled ${audiobook.AudioBookName} has been uploaded. Check out here 👉🏻 <a href='https://skillquest.hexstaruniverse.com/audio/${audiobook._id}'> Click here</a>.</P>
        <p>Thanks & Regards, <br>Team Hex-Star Universe</p>
        </td>
        </tr>
        </tbody>
        </table>
        </div>
        </body>
        </head>
        </html>`
    });

})

module.exports = emailQueue;