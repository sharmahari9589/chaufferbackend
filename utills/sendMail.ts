import nodemailer from "nodemailer";

export const sendMail = async(email:any,subject:any,data:any) =>{
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "telehealthonlineconsultation@gmail.com",
          pass: "rjwmatiqakwfnnfu",
        },
      });
    
      // Define the email message
      const message = {
        from: "telehealthonlineconsultation@gmail.com",
        to: email,
        subject: subject,
        html: data
      };
    
      // Send the email using Nodemailer
      transporter.sendMail(message, (error, info) => {
        
      })
}