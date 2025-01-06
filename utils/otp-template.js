const nodemailer = require("nodemailer")
module.exports = {
    otpEmailNotification: async (data, callBack) => {
        // let query = User.findOne({email: email})
        // .then(results=>{
            console.log(data)
            const output =  
            `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your OTP Code</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4a4a4a;
            color: #ffffff;
            text-align: center;
            padding: 20px;
        }
        .content {
            padding: 20px;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            padding: 10px;
            background-color: #f0f0f0;
            margin: 20px 0;
        }
        .footer {
            background-color: #f4f4f4;
            text-align: center;
            padding: 10px;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your OTP Code</h1>
        </div>
        <div class="content">
            <p>Dear ${data.username}</p>
            <p>You have requested to reset your password or change your password. Please use the following One-Time Password (OTP) to complete the process:</p>
            <div class="otp-code">${data.message}</div>
            <p>If you didn't request this change, please ignore this email or contact our support team immediately.</p>
            <p>Thank you for your attention to account security.</p>
            <p>Blessings,<br>King Dunamis Ministries Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 King Dunamis Ministries. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`

            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: true,
                auth: {
                  user: process.env.EMAIL_USER,
                  pass: process.env.EMAIL_PASSWORD,
                },
                tls: {
                  rejectUnauthorized: false,
                },
              });
              transporter.verify((err, success) => {
                if (err) {
                  console.log(err);
                }else{
                console.log("server is ready to receive message " + success);
                }
              });
              await transporter.sendMail(
                  {
                      from: `"King Dunamis Ministries Team" <${process.env.EMAIL_USER}>`,
                      to: `${data.email}`,
                      subject: `${data.title}`,
                      html: output, // html body
                    },
      
                  function(err, info){
                      if(err){
                          console.log(err)
                          return
                      }
                      console.log('message sent: %s', info.messageId)
                   
          
                 
              })
        //   }
        // );
      },
}