import express from "express";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(new URL("../public/index.html", import.meta.url).pathname);
});

app.post("/send-email", async (req, res) => {
    try {
        const { to, subject, message ,attachments} = req.body;

        console.log(attachments);

        const isHtml = /<[a-z][\s\S]*>/i.test(message);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            [isHtml ? 'html' : 'text']: message,
            // attachments :[
            //     { // use URL as an attachment
            //       filename: 'xxx.jpg',
            //       path: ''
            //     }
            //   ]
        };

        await transporter.sendMail(mailOptions);

        res.sendFile(new URL("../public/response.html", import.meta.url).pathname);
    } catch (error) {
        console.error('Error sending email:', error);
        res.sendFile(new URL("../public/error.html", import.meta.url).pathname);
    }
});

app.listen(process.env.PORT, () => {
    console.log("Server is running");
});
