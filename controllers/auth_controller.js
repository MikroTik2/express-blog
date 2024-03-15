const User = require("../models/db/user_model.js");
const ErrorHandler = require("../utils/error_handler.js");
const asyncHandler = require("../middlewares/async_handler.js");
const sendToken = require("../utils/send_token.js");
const sendEmail = require("../utils/send_email.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary").v2;


// Function to register a new user.
const register = asyncHandler(async (req, res, next) => {
     const { username, email, password } = req.body;

     // Upload avatar image to Cloudinary
     const myCloud = await cloudinary.uploader.upload(req.body.avatar, {
          folder: 'avatars',
          width: 150,
          crop: 'scale',
     });

     // Create a new user with the provided data and uploaded avatar
     const user = await User.create({
          username,
          email,
          password,
          avatar: {
               public_id: myCloud.public_id,
               url: myCloud.url,
          },
     });

     // Send token with user data in response
     sendToken(user, 201, res);
});

const login = asyncHandler(async (req, res) => {
     const { email, password } = req.body;

     try {

          if (!email || !password) return next(new ErrorHandler("Please enter email and password", 400));

          const user = await User.findOne({ email }).select("+password");
          
          if (!user) return next(new ErrorHandler("Invalid email or password", 401));
          
          const isPasswordMatched = await user.comparePassword(password);
          
          if (!isPasswordMatched) return next(new ErrorHandler("Invalid email or password", 401));
          
          sendToken(user, 201, res);

     } catch (error) {
          return next(new ErrorHandler(error));
     };
});

const logoutUser = asyncHandler(async (req, res, next) => {
     res.cookie("token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
     });

     res.status(200).json({
          success: true,
          message: "Logged Out",
     });
});

const forgotPassword = asyncHandler(async (req, res, next) => {

     const user = await User.findOne({email: req.body.email});
     console.log(user);
     if(!user) return next(new ErrorHandler("User Not Found", 404));
 
     const resetToken = await user.getResetPasswordToken();
     console.log(resetToken);
 
     await user.save({ validateBeforeSave: false });

     const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`;
     console.log(resetPasswordUrl);
     const message = `
                    <html>
                    <head>
                    <style>
                         body {
                              font-family: Arial, sans-serif;
                              text-align: center;
                         }

                         .container {
                              width: 50%;
                              margin: auto;
                              padding: 20px;
                              border: 1px solid #ccc;
                              border-radius: 8px;
                              background-color: #f5f5f5;
                         }

                         h2 {
                              color: #333;
                         }

                         p {
                              color: #555;
                              text-align: center; /* Center text within paragraphs */
                              margin-bottom: 15px; /* Add some space between paragraphs */
                         }

                         a {
                              color: #ffffff;
                              text-decoration: none; /* Corrected typo here */
                         }

                         .button {
                              display: inline-block;
                              padding: 10px 20px;
                              font-size: 16px;
                              text-align: center;
                              text-decoration: none;
                              cursor: pointer;
                              background-color: #000000;
                              border-radius: 4px;
                              color: #ffffff; /* Set text color for the button */
                         }
                    </style>
                    </head>
                    <body>
                    <div class="container">
                         <h2>Password Reset</h2>
                         <img style="width: 100%; height: 550px;" src="https://cdn.discordapp.com/attachments/998880915474350161/1025124923775127672/80C1DC67-8CC7-469B-BCC3-C878EF497370.gif?ex=659704fb&is=65848ffb&hm=84e583804a5ee06029b802c4a9aa11bc0f3a7499218f0df84d429d19130680d6&" alt="Hello world!" />
                         <p>Your password reset token is:</p>
                         <p>This is some additional text explaining the password reset process. You can add more information here.</p>
                         <p style="text-align: center;"> <a href="${resetPasswordUrl}" class="button" style="color: white;">Reset Password</a> </p>
                    </div>
                    </body>
               </html>
     `;

     try {

          await sendEmail({
               email: user.email,
               subject: "Please reset your password.",
               html: message,
          });

          res.status(200).json({
               success: true,
               message: `Email sent to ${user.email} successfully`,
          });

     } catch (error) {

          user.resetPasswordExpire = undefined;
          user.resetPasswordToken = undefined;

          await user.save({ validateBeforeSave: false });

     };
});

const resetPassword = asyncHandler(async (req, res, next) => {

     const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

     const user = await User.findOne({
          resetPasswordToken,
          resetPasswordExpire: { $gt: Date.now() },
     });

     if (!user) return next(new ErrorHandler("Invalid reset password token", 404));

     user.password = req.body.password;
     user.resetPasswordToken = undefined;
     user.resetPasswordExpire = undefined;

     await user.save();
     sendToken(user, 201, res);
});

module.exports = {
     register,
     login,
     forgotPassword,
     resetPassword,
};