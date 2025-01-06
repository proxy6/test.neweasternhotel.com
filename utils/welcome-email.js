const nodemailer = require("nodemailer")
module.exports = {
    welcomeEmailNotification: async (data, callBack) => {
        // let query = User.findOne({email: email})
        // .then(results=>{
            const output = 
         `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to King Dunamis Ministries</title>
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
            <h1>Welcome to King Dunamis Ministries</h1>
        </div>
        <div class="content">
            <p>Dear ${data.username},</p>
            <p>Welcome to King Dunamis Ministries! We're excited to have you join our community. Below are your account details:</p>
            <ul>
                <li><strong>Email:</strong> ${data.email}</li>
                <li><strong>Default Password:</strong> ${data.password}</li>
            </ul>
            <p>For security reasons, you will be required to change your password upon your first login.</p>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
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