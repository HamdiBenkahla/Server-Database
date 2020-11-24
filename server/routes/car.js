const express = require('express');
const router = express.Router();
const AuthJwt = require('../Middleware/auth.jwt.js')

const {Car} = require('../../database/models');



router.get("/:id", async (req, res) => {
  console.log(typeof req.params.id)
  const id = Number(req.params.id);
  const car= await Car.findOne({where: { driverId :id } })
// console.log(car)
  res.json(car)
});



router.post("/carId",async(req,res)=>{
  const car= await Car.findOne({where: { driverId :req.body.driverId } })
  const id=car
  console.log(id)
  if(!id) return res.status(400).send("No car found")
  if(id) return res.status(200).json(id)
});


router.post("/create",  async (req, res) => {
  console.log(req.body)
  const carExist = await Car.findOne({
    where: { VIN: req.body.VIN },
  }); 
  if (carExist) return res.send({message: "there's a car already registred by this number"});
  const car = await Car.create({
      model: req.body.model,
      fuelType: req.body.fuelType,
      color:req.body.color,
      VKT: req.body.VKT,
      VIN: req.body.VIN,
      maxSeats: req.body.maxSeats,
      driverId: req.body.driverId
    })
  res.json(car)
})

module.exports = router;