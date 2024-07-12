const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendApprovedMail = async (name, link, email) => {

    await resend.emails.send({
        from: 'network@hexstaruniverse.com',
        to: email,
        subject: 'Congratulations on successfull submission',
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
                <p><span>Hi ${name}, Congratulations!</span></p>
                <p> Congratulations! Your submission has been approved. View your submission here 👉🏻 <a href=${link}> Click here</a>.</P>
                </td>
                </tr>
                </tbody>
                </table>
                </div>
                </body>
            </head>
        </html>
        `
    })
    .then(() => {
        return 1;
    })
    .catch((err) => {
        return err.message;
    })
}

module.exports = { sendApprovedMail }