const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

/* Error Handling */

process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:");
    console.error(err);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:");
    console.error(err);
});

/* Middleware */

const allowedOrigin = process.env.FRONTEND_URL;

app.use(cors({
  origin: allowedOrigin || true,
  credentials: true
}));
app.use(express.json());

/* Home Route */

app.get("/", (req, res) => {
    res.send("Backend is running");
});

/* Contact Route */

app.post("/contact", async (req, res) => {

    console.log("CONTACT ROUTE HIT");
    console.log(req.body);

    const { name, email, subject, message } = req.body;

    try {

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            replyTo: email,

            to: process.env.EMAIL_USER,

            subject: `Portfolio Contact: ${subject}`,

            html: `
                <h2>New Portfolio Message</h2>

                <p><strong>Name:</strong> ${name}</p>

                <p><strong>Email:</strong> ${email}</p>

                <p><strong>Subject:</strong> ${subject}</p>

                <p><strong>Message:</strong></p>

                <p>${message}</p>
            `
        });

        console.log("EMAIL SENT");

        res.status(200).json({
            success: true,
            message: "Message sent successfully"
        });

    } catch (error) {

        console.error("EMAIL ERROR:");
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to send message"
        });
    }
});

/* Start Server */

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on("error", (err) => {
    console.error("SERVER ERROR:");
    console.error(err);
});
