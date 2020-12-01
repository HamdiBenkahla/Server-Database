const router = require("express").Router();
const cloudinary = require("cloudinary").v2;
const fileupload = require("express-fileupload");
const {Driver, Passenger} = require('../../database/models');


cloudinary.config({
    cloud_name: "dc36tjyia",
    api_key: "437616963218966",
    api_secret: "ueycbgonEPNA8aBGHSAn8lh_FLc",
  });

router.put('/upload/:id', async (req, res) => {
  try {
    userId = +req.params.id
    const file = req.files.file;
    cloudinary.uploader.upload(file.tempFilePath, async (err,result) => {
      if(req.body.type === 'passenger') {
        await Passenger.update({imageUrl : result.url}, { where : {id : userId}})
      } else {
        await Driver.update({imageUrl : result.url}, { where : {id : userId}})
      }
        res.json({
            success: true,
            result 
        })
    })
  } catch(error) {
    res.status(500).json(error);
  }
    

})



  module.exports = router;