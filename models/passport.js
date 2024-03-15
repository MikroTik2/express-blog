const passport = require("passport");
const cloudinary = require("cloudinary").v2;
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("./db/user_model.js");
const dotenv = require("dotenv").config();

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.GOOGLE_CALLBACK_URL;

passport.use(new GoogleStrategy({
     clientID: clientID,
     clientSecret: clientSecret,
     callbackURL: callbackURL,
     passReqToCallback: true,
}, async function(request, accessToken, refreshToken, profile, done) {
     const user = await User.findOne({ googleId: profile.id });

     const myCloud = await cloudinary.uploader.upload(profile.photos[0].value, {
          folder: 'avatars',
          width: 150,
          crop: 'scale',
     });
 
     if (!user) {
          let newUser = await User.create({
               googleId: profile.id,
               username: profile.displayName,
               email: profile.emails[0].value,
               pr: profile.provider,
               avatar: {
                    public_id: myCloud.public_id,
                    url: myCloud.url,
               },
          });

          done(null, newUser);
     } else {
          done(null, user);
     };
}));

passport.serializeUser((user, done) => {
     done(null, user);
});

passport.deserializeUser((user, done) => {
     done(null, user);
});

module.exports = passport;