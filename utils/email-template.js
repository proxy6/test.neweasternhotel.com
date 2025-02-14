const nodemailer = require("nodemailer")
module.exports = {
    EmailNotification: async (data, callBack) => {
        // let query = User.findOne({email: email})
        // .then(results=>{
            const output = 
           `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
           <html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
            <head>
             <meta charset="UTF-8">
             <meta content="width=device-width, initial-scale=1" name="viewport">
             <meta name="x-apple-disable-message-reformatting">
             <meta http-equiv="X-UA-Compatible" content="IE=edge">
             <meta content="telephone=no" name="format-detection">
             <title>EmmdosTee Confirm Email</title><!--[if (mso 16)]>
            
               <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
           <xml>
               <o:OfficeDocumentSettings>
               <o:AllowPNG></o:AllowPNG>
               <o:PixelsPerInch>96</o:PixelsPerInch>
               </o:OfficeDocumentSettings>
           </xml>
           <![endif]-->
             <style type="text/css">
           .rollover:hover .rollover-first {
             max-height:0px!important;
             display:none!important;
             }
             .rollover:hover .rollover-second {
             max-height:none!important;
             display:block!important;
             }
             .rollover span {
             font-size:0px;
             }
             u + .body img ~ div div {
             display:none;
             }
             #outlook a {
             padding:0;
             }
             span.MsoHyperlink,
           span.MsoHyperlinkFollowed {
             color:inherit;
             mso-style-priority:99;
             }
             a.es-button {
             mso-style-priority:100!important;
             text-decoration:none!important;
             }
             a[x-apple-data-detectors] {
             color:inherit!important;
             text-decoration:none!important;
             font-size:inherit!important;
             font-family:inherit!important;
             font-weight:inherit!important;
             line-height:inherit!important;
             }
             .es-desk-hidden {
             display:none;
             float:left;
             overflow:hidden;
             width:0;
             max-height:0;
             line-height:0;
             mso-hide:all;
             }
             .es-button-border:hover > a.es-button {
             color:#1376c8!important;
             }
           @media only screen and (max-width:600px) {*[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:100%!important } h6, h6 a { line-height:120%!important } h1 { font-size:30px!important; text-align:center } h2 { font-size:24px!important; text-align:center } h3 { font-size:18px!important; text-align:center } h4 { font-size:24px!important; text-align:left } h5 { font-size:18px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:18px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:14px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:14px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .es-social td { padding-bottom:10px } .h-auto { height:auto!important } p, ul li, ol li, a { font-size:14px!important } .es-button { font-size:14px!important; display:inline-block!important } }
           @media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
           </style>
            </head>
            <body class="body" style="width:100%;height:100%;padding:0;Margin:0">
             <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FFFFFF"><!--[if gte mso 9]>
                 <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                   <v:fill type="tile" color="#ffffff"></v:fill>
                 </v:background>
               <![endif]-->
              <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FFFFFF">
                <tr style="border-collapse:collapse">
                 <td valign="top" style="padding:0;Margin:0">
            
                  <table cellpadding="0" cellspacing="0" class="es-header" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
                    <tr style="border-collapse:collapse">
                     <td align="center" style="padding:0;Margin:0">
                      <table class="es-header-body" cellspacing="0" cellpadding="0" bgcolor="#FFFFFF" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
                        <tr style="border-collapse:collapse">
                         <td style="Margin:0;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px;background-position:center bottom" align="left">
                          <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr style="border-collapse:collapse">
                             <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                              <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr style="border-collapse:collapse">
                                 <td align="center" style="padding:0;Margin:0;font-size:0">
                                   <a target="_blank" href="https://emmdostee.com" style="mso-line-height-rule:exactly;text-decoration:underline;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;font-size:14px;color:#1376C8">
                                   <img src="https://emmdostee.com/frontend/assets/img/footerlogo.png" alt="" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none" width="128"></a></td>
                                </tr>
                              </table></td>
                            </tr>
                          </table></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table>
           
                  <table class="es-content" cellspacing="0" cellpadding="0" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                    <tr style="border-collapse:collapse">
                     <td style="padding:0;Margin:0;background-color:#F3F3F3" bgcolor="#f3f3f3" align="center">
                      <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" cellspacing="0" cellpadding="0" bgcolor="transparent" align="center" role="none">
                        <tr style="border-collapse:collapse">
                         <td style="Margin:0;padding-right:20px;padding-left:20px;padding-top:25px;padding-bottom:5px;background-position:right bottom" align="left">
                          <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr style="border-collapse:collapse">
                             <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                              <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr style="border-collapse:collapse">
                                 <td align="center" style="padding:0;Margin:0;padding-top:20px;padding-bottom:10px"><h1 style="Margin:0;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:34px;font-style:normal;font-weight:normal;line-height:41px;color:#333333">Please confirm
                                   your email address</h1></td>
                                </tr>
                                <tr style="border-collapse:collapse">
                                 <td class="es-m-txt-c" align="center" style="padding:0;Margin:0;padding-bottom:20px"><h5 style="Margin:0;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:25px;font-style:normal;font-weight:normal;line-height:41px;color:#333333">Thanks for joining EmmdosTee!</h5></td>
                                </tr>
                                <tr style="border-collapse:collapse">
                                 <td class="es-m-txt-c" align="center" style="padding:0;Margin:0;padding-bottom:15px;padding-top:5px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;line-height:24px;letter-spacing:0;color:#333333;font-size:16px">To finish signing up, please confirm your email address using the otp below. This ensures we have the right email in case we need to contact you.</p></td>
                                </tr>
                            
                                <tr style="border-collapse:collapse">
                                 <td class="es-m-txt-c" align="center" style="padding:0;Margin:0;padding-bottom:30px"><h3 style="Margin:0;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;mso-line-height-rule:exactly;letter-spacing:1px;font-size:18px;font-style:normal;font-weight:normal;line-height:22px;color:#333333"><strong>USE CODE: ${data.message}</strong></h3></td>
                                </tr>
                              </table></td>
                            </tr>
                          </table></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table>
                  <table cellpadding="0" cellspacing="0" class="es-content" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
                    <tr style="border-collapse:collapse">
                     <td align="center" style="padding:0;Margin:0">
                      <table class="es-content-body" cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
                        <tr style="border-collapse:collapse">
                         <td style="Margin:0;padding-top:20px;padding-right:20px;padding-bottom:20px;padding-left:20px;background-position:center bottom" align="left">
                          <table width="100%" cellspacing="0" cellpadding="0" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                            <tr style="border-collapse:collapse">
                             <td valign="top" align="center" style="padding:0;Margin:0;width:560px">
                              <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                                <tr style="border-collapse:collapse">
                                 <td align="center" class="es-infoblock" style="padding:0;Margin:0">
                                   <p style="Margin:0;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;line-height:24px;letter-spacing:0;color:#CCCCCC;font-size:16px">You have received this email as a registered user of emmdostee.com.</p>
                                   
                                 </td>
                                </tr>
                                <tr style="border-collapse:collapse">
                                 <td class="es-infoblock" align="center" style="padding:0;Margin:0;padding-top:10px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;line-height:24px;letter-spacing:0;color:#CCCCCC;font-size:16px">© EmmdosTee Studio.</p></td>
                                </tr>
                              </table></td>
                            </tr>
                          </table></td>
                        </tr>
                      </table></td>
                    </tr>
                  </table></td>
                </tr>
              </table>
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
                      from: `"Tessy From EmmdosTee" <${process.env.EMAIL_USER}>`,
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