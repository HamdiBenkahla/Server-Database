const {Passenger} = require('../../database/models');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


router.get("/", async (req, res) => {
    await Passenger.findAll().then((passengers) => res.json(passengers));
  });

  router.get("/:id", async (req, res) => {
    await Passenger.findByPk(req.params.id).then((passenger) => res.json(passenger));
  });


  router.post("/register", async (req, res) => {
    console.log(req.body)
  const emailExist = await Passenger.findOne({
    where: { email: req.body.email },
  }); 
  if (emailExist) return res.status(400).send("Email already exist");
  const salt = await bcrypt.genSalt(10);
  console.log(req.body.password);
  const hashPassword = await bcrypt.hash(req.body.password, salt); 
   console.log(hashPassword);
  const passenger = await Passenger.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password:hashPassword,
      email: req.body.email,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      ICN: req.body.ICN
    })
  res.json(passenger)
})


router.post("/login", async (req, res) => {
    const user = await Passenger.findOne({ where: { email: req.body.email } });
    if (!user) return res.status(400).send("Email is not found");
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send("Invalid password ");
    res.status(200).json({
        idpassenger: user.id,
        token: jwt.sign(
          { userId: user.id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '30*60' } 
        )
      });
       
  });  router.delete("/:id", async (req, res) => {
    await Passenger.findByPk(req.params.id)
      .then((passenger) => {
        passenger.destroy();
      })
      .then(() => {
        res.json("deleted");
      });
  });




  module.exports = router;