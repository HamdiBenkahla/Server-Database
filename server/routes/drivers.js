const express = require('express');
const router = express.Router();
const {Driver} = require('../../database/models');
const AuthJwt = require('../Middleware/auth.jwt.js')

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')


router.get("/", async (req, res) => {
    await Driver.findAll().then((drivers) => res.json(drivers));
  });

  router.get("/:id", AuthJwt, async (req, res) => {
    await Driver.findByPk(req.params.id).then((drivers) => res.json(drivers));
  });



  router.post("/register", async (req, res) => {
    const emailExist = await Driver.findOne({
      where: { email: req.body.email },
    }); 
    if (emailExist) return res.send({message: "Email already exist"});
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt); 
    const driver = await Driver.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password:hashPassword,
        email: req.body.email,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        ICN: req.body.ICN,
        driverLicense: req.body.driverLicense
      });
    res.json({
      driver: driver,
        accessToken : jwt.sign(
          { id: driver.id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: 2*60 }
        )
      })
  })

  router.post("/login", async (req, res) => {
    console.log(req.body)
    const user = await Driver.findOne({ where: { email: req.body.email } });
    if (!user){
       return res.json({ message :"Email is not found"}) }
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.send({message: "Invalid password "});
    res.status(200).json({
      driver: user,
        accessToken : jwt.sign(
          { id: user.id },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: 2*60 } //expires in by seconds
        )
      });
  });

  router.put("/:id", async (req, res) => {
    Driver.findByPk(req.params.id).then((drivers) => {
      drivers.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password:hashPassword,
            email: req.body.email,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            ICN: req.body.ICN,
            driverLicense: req.body.driverLicense,
            timesRated: req.body.timesRated,
            rating: req.body.rating
        })
        .then((drivers) => {
          res.json(drivers);
        });
    });
  });



  router.delete("/:id", async (req, res) => {
    await Driver.findByPk(req.params.id)
      .then((drivers) => {
        drivers.destroy();
      })
      .then(() => {
        res.json("deleted");
      });
  });



  module.exports = router;