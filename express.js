const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoStore = require("connect-mongo");
const mongoose = require('mongoose');
const passport = require("./models/passport.js");
const dotenv = require('dotenv').config();

const authRoute = require("./routes/auth_route.js");
const userRoute = require("./routes/user_route.js");
const blogRoute = require("./routes/blog_route.js");
const commentRoute = require("./routes/comment_route.js");

const app = express();
const clientPromise = mongoose.connect(process.env.MONGO_URL);

// APP - SETUP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(cors());

// APP - SESSION
app.use(session({
    secret: process.env.SECRET_SESSION,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 19 * 60000 },
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        dbName: "blog",
        clientPromise,
        autoRemove: 'native',
        ttl: 14 * 24 * 60 * 60,
        autoRemoveInterval: 10
    }),
}));

// APP - PASSPORT
app.use(passport.initialize());
app.use(passport.session());

// APP - ROUTES
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/blog', blogRoute);
app.use('/api/comment', commentRoute);

module.exports = app;