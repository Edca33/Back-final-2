import nodemailer from 'nodemailer';
import dotenv from 'dotenv';


dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',  
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS   
    }
});


const sendMail = async (to, subject, text, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,  
        to,                           
        subject,                       
        text,                          
        html                           
    };

    try {
        
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);  
    } catch (error) {
        console.error('Error sending email:', error);  
    }
};

export default sendMail;
