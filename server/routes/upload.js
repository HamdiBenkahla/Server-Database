const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");


cloudinary.config({
    cloud_name: "dc36tjyia",
    api_key: "437616963218966",
    api_secret: "ueycbgonEPNA8aBGHSAn8lh_FLc",
  });

router.post('/upload', (req, res) => {
  const file = req.files.photo;
  console.log(file);
cloudinary.uploader.upload(file.tempFilePath, function(err,result){
    res.send({
        success: true,
        result 
    })
})

})



  module.exports = router;