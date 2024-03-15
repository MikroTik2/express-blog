const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
let blogSchema = new mongoose.Schema({
     title:{
          type:String,
          required:true,
     },
     description:{
          type:String,
          required:true,
     },
     slug: {
          type: String,
          required: true,
     },
     images: [{
          public_id: {
               type: String
          },
          url: {
               type: String
          }
     }],
     numViews:{
          type:Number,
          default: 0,
     },
     isLiked:{
          type:Boolean,
          default: false,
     },
     isDisliked:{
          type:Boolean,
          default:false,
     },
     
     author: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
     comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
     likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
     dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
     ,
}, { toJSON: { virtuals: true }, toObject: { virtuals: true }, timestamps: true });

//Export the model
module.exports = mongoose.model('Blog', blogSchema);