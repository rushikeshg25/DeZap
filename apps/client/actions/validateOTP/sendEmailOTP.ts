"use server";
import prisma from "@repo/db";
import nodemailer from "nodemailer";
import { OTPType } from "@repo/db/types";
const user: string = process.env.MAIL_USER!;
const app_password: string = process.env.MAIL_APP_PASSWORD!;
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smt.gamil.com",
  port: 587,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: user,
    pass: app_password,
  },
});
export const sendEmailOTP = async (to: string, userId: string) => {
  let OTP = Math.floor(1000 + Math.random() * 9000).toString();
  await prisma.oTP.create({
    data: {
      otpType: OTPType.EMAIL,
      otpID: to,
      otp: OTP,
      userId: userId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });
  const mailOptions = {
    from: {
      name: "DeZap",
      address: user,
    },
    to: to,
    subject: "OTP for DeZap",
    text: "OTP Verfication",
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
                    .p{
                       font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="content">
                        <p>Dear User,</p>
                        <p>Your OTP for DeZap is:</p>
                        <p>${OTP}</p>
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
    console.log("error", error);
    return { sucess: false };
  }
};
