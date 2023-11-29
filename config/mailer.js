import nodemailer from 'nodemailer';

// Configure email & send it
const sendMail = async (email, otp) => {
    // Creating Transport carrier for email
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'vinayakt890@gmail.com',
            pass: 'dgznasjdxcnvnptq',
        }
    });

    // Defining mail payload
    const mailOptions = {
        to: email,
        from: 'vinayakt890@gmail.com',
        subject: 'OTP Password Reset Request',
        html: `<p>Your Otp to reset your password(expire in 1 minute): <b>${otp}</b></p>`,
    };

    // Sending email with Nodemailer
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending OTP via email.', err);
        }
        console.log('OTP has been sent to your email address.' + info.response);

    });
};
export default sendMail;