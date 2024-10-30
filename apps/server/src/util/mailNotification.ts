import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const user: string = process.env.MAIL_USER!;

const app_password: string = process.env.MAIL_APP_PASSWORD!;

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smt.gamil.com",
  port: 587,
  secure: false,
  auth: {
    user: user,
    pass: app_password,
  },
});

export const sendEmailNotification = async (to: string, activity: string) => {
  const mailOptions = {
    from: {
      name: "DeZap",
      address: user,
    },
    to: to,
    subject: "New Activity ..",
    text: "You got a new Activity",
    html: `
           <html>
            <head>
                <style>
                    .container {
                        font-family: Arial, sans-serif;
                        text-align: center;
                        margin: 20px;
                    }
                    .logo {
                        width: 200px;
                        margin-bottom: 20px;
                    }
                    .content {
                        font-size: 16px;
                        color: #333;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <h1>Gm Gm!</h1>
                        <p>Dear User,</p>
                        <p>Your account has new activity.</p>
                        <p>${activity}</p>
                    </div>
                </div>
            </body>
        </html>
        `,
  };
  try {
    await transporter.sendMail(mailOptions);
    return { sucess: true };
  } catch (error) {
    return { sucess: false };
  }
};
