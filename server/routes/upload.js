const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const {Driver} = require('../../database/models');
const config = require("../../config.js");


cloudinary.config({
    cloud_name: "dc36tjyia",
    api_key: "437616963218966",
    api_secret: "ueycbgonEPNA8aBGHSAn8lh_FLc",
  });

router.post('/upload',  (req, res) => {
    console.log(req.body,'dff')
  const file = req.files.file;
  console.log(file);
cloudinary.uploader.upload(file.tempFilePath, function(err,result){

    res.json({
        success: true,
        result 
    })

})

})



  module.exports = router;