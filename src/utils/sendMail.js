const nodemailer = require("nodemailer");
const sgTransport = require('nodemailer-sendgrid-transport');

const sendEmail = async (mail, subject, text, html) => {

    let transporter = nodemailer.createTransport(
        sgTransport({
            auth: {
                api_key: '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',
            },
        })
    );

    transporter.verify(function (error, success) {
        if (error) {
        console.log(error);
        } else {
        console.log("SMTP Server is ready");
        }
    });

    // Envoyer l'e-mail avec l'adresse e-mail vérifiée dans SendGrid
    const info = await transporter.sendMail({
        from: process.env.ADMIN_EMAIL,
        to: mail, 
        subject: subject,
        text: text, 
        html: html
    });

    console.log('E-mail sent:', info);

    return info;

}

module.exports = sendEmail;