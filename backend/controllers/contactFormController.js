import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';

// @description: Send Email of details from contact form
// @route: POST /api/contact
// @access: Public
const sendContactForm = asyncHandler(async (req, res, next) => {
  const { name, email, message } = req.body;

  if ((name, email, message)) {
    res.status(201).json({
      message: 'Contact form sent successfully',
    });
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: process.env.MAILER_HOST,
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PW,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"May Shop" <info@trilogywebsolutions.co.uk>', // sender address
      to: `${email}`, // list of receivers
      subject: 'MayShop Contact Request', // Subject line
      text: 'MayShop Contact Request', // plain text body
      bcc: 'me@garyallin.uk',
      html: `
      <h1>Hi ${name}</h1>
      <p>${message}</p>    
      `, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  } else {
    res.status(400);
    throw new Error('Contact FORM error');
  }
});

export { sendContactForm };
