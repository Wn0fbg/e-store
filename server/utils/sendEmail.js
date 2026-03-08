import nodeMailer from "nodemailer";

export const sendEmail = async({email, subject, message}) => {
    const transporter = nodeMailer.createTransport({
         host: process
    })
}
