import { betterAuth } from "better-auth";
import { emailOTP, username } from "better-auth/plugins";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import nodemailer from "nodemailer";
import { nextCookies } from "better-auth/next-js";
import { db } from "./db";

export const auth = betterAuth({
    database: mongodbAdapter(db),
    appName: "zapply",
    basePath: "/api/v1/auth",
    plugins: [
        emailOTP({
            allowedAttempts: 5,
            sendVerificationOnSignUp: true,
            async sendVerificationOTP({ email, otp, type }) {
                switch (type) {
                    case "email-verification":
                        await sendEmail(email, `Verify Your Email | Zapply`, VerifyEmailTemplate(otp));
                        break;
                    case "forget-password":
                        await sendEmail(email, `Password Reset Code | Zapply`, ForgetEmailTemplate(otp));
                        break;
                }
            },
        }),
        username(),
        nextCookies(),
    ],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        minPasswordLength: 6,
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        expiresIn: 10 * 60,
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60,
        },
    },
    advanced: {
        cookiePrefix: "zapply",
        useSecureCookies: process.env.NODE_ENV === "production",
        crossSubDomainCookies: {
            enabled: process.env.NODE_ENV === "production",
        },
    },
    cors: {
        allowedOrigins: [
            "https://zapply.cloud",
            "https://www.zapply.cloud",
            process.env.NEXT_PUBLIC_APP_URL,
        ],
        allowCredentials: true,
    },
    socialProviders: {
        google: ({
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    }
});


const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        await transporter.sendMail({
            from: `"Zapply" <${process.env.EMAIL_FROM}>`,
            to,
            subject,
            html,
        });
    } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error("Failed to send email.");
    }
}

const VerifyEmailTemplate = (otp: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                                <h2 style="text-align: center; color: #333;">Your One-Time Password</h2>
                                <p>Hello,</p>
                                <p>Use the following One-Time Password (OTP) to complete your action. This OTP is valid for 10 minutes.</p>
                                <div style="text-align: center; margin: 20px 0;">
                                    <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #f0f0f0; border-radius: 5px; letter-spacing: 5px;">
                                        ${otp}
                                    </span>
                                </div>
                                <p>If you did not request this code, please ignore this email.</p>
                                <hr style="border: none; border-top: 1px solid #ddd;" />
                                <p style="font-size: 12px; color: #888; text-align: center;">This is an automated message. Please do not reply.</p>
                            </div>
`;

const ForgetEmailTemplate = (otp: string) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                                <h2 style="text-align: center; color: #333;">Password Reset Code</h2>
                                <p>Hello,</p>
                                <p>Use the following One-Time Password (OTP) to reset your password. This OTP is valid for 10 minutes.</p>
                                <div style="text-align: center; margin: 20px 0;">
                                    <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #f0f0f0; border-radius: 5px; letter-spacing: 5px;">
                                        ${otp}
                                    </span>
                                </div>
                                <p>If you did not request this code, please ignore this email.</p>
                                <hr style="border: none; border-top: 1px solid #ddd;" />
                                <p style="font-size: 12px; color: #888; text-align: center;">This is an automated message. Please do not reply.</p>
                            </div> 
`;