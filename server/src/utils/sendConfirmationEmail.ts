import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: './configs/env/.env.dev' });

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export const sendMail = async (to: string, subject: string, content: string, isHtml: boolean = false) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        [isHtml ? 'html' : 'text']: content,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail envoyé : ' + info.response);
    } catch (err) {
        console.error('Erreur lors de l\'envoi de l\'e-mail : ', err);
    }
};
