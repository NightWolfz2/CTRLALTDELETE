const nodemailer = require('nodemailer');
const crypto = require('crypto');
const VerificationToken = require('../models/verificationToken'); 

exports.generateToken = () => {
    let verifToken = ''
    for(let i=0; i<=3;i++) {
        const randVal = Math.round(Math.random() * 9)
        verifToken = verifToken + randVal
    }
    return verifToken;
}

exports.mailTransport = () => nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
});

exports.generateEmailTemplate = (code,fname) => {
    return `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #353535;text-decoration:none;font-weight:600">Ninja Manager</a>
    </div>
    <p style="font-size:1.1em">Hi ${fname},</p>
    <p>Thank you for using Ninja Manager. Use the following OTP to complete your Sign Up procedures. This OTP is valid for 1 minutes</p>
    <h2 style="background: #353535;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
    <p style="font-size:0.9em;">Regards,<br />CtrlAltDelete Team</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
    </div>
  </div>
</div>
    `
}

exports.generatePasswordTemplate = (code,fname) => {
  return `
  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
<div style="margin:50px auto;width:70%;padding:20px 0">
  <div style="border-bottom:1px solid #eee">
    <a href="" style="font-size:1.4em;color: #353535;text-decoration:none;font-weight:600">Ninja Manager</a>
  </div>
  <p style="font-size:1.1em">Hi ${fname},</p>
  <p>Thank you for using Ninja Manager. Use the following OTP to change your password. This OTP is valid for 1 minutes</p>
  <h2 style="background: #353535;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${code}</h2>
  <p style="font-size:0.9em;">Regards,<br />CtrlAltDelete Team</p>
  <hr style="border:none;border-top:1px solid #eee" />
  <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
  </div>
</div>
</div>
  `
}

exports.sendForgotPasswordEmail = (url) => {
  
    return emailTemplate = `
    <p>Hi,</p>
    <p>You requested a password reset. Please click on the link below to reset your password:</p>
    <a href="${url}">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
    `;

};
exports.sendForgotPasswordEmailConfirm = () => {
  
  return emailTemplate = `
  <p>Hi,</p>
  <p>Your password has been reset.</p>
  `;

};