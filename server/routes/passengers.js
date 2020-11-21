const {Passenger} = require('../../database/models');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ride = require('../../database/models/ride');


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
  if (emailExist) return res.send({message: "Email already exist"});
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt); 
  const passenger = await Passenger.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password:hashPassword,
      email: req.body.email,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      ICN: req.body.ICN
    })
  res.status(200).json({
    passenger: passenger,
    accessToken: jwt.sign(
      { id: passenger.id },
      'RANDOM_TOKEN_SECRET',
      { expiresIn: 30*60 } 
    )
  })
})

router.post("/login", async (req, res) => {
  console.log(req.body)
    const user = await Passenger.findOne({ where: { email: req.body.email } });
    if (!user) {res.json({ message :"Email is not found"}) }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.json({message: "Invalid password "});
    res.status(200).json({
        passenger: user,
        accessToken: jwt.sign(
          { id: user.id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: 30*60 } 
        )
      });
       
  });  
   
  router.delete("/:id", async (req, res) => {
    await Passenger.findByPk(req.params.id)
      .then((passenger) => {
        passenger.destroy();
      })
      .then(() => {
        res.json("deleted");
      });
  });





  // const passenger= await sequelize.query(`INSERT INTO passenger(firstName,lastName,address,phoneNumber,email,password,ICN) VALUES("${firstName}","${lastName}","${address}","${phoneNumber}","${email}","${password}","${ICN}"`, { type: QueryTypes.INSERT});


  module.exports = router;