const express = require('express');
const router= express.Router();
const {Ride, Passenger} = require('../../database/models');
// const db = require("../../database/models/ride");
// const { Model } = require('sequelize/types');


router.get('/', async(req, res) => {
    await Ride.findAll().then((ride) => res.json(ride))
});


router.get('/ride', async(req, res) => {
    await Ride.findOne({where: {date: req.body.date}}).then((ride) => res.json(ride))
});


router.post('/create', async(req, res) => {
    console.log(req.body)
    await Ride.create({
        departure: req.body.departure,
        destination: req.body.destination,
        time: req.body.time,
        date: req.body.date,
        price: req.body.price,
        seats: req.body.seats,
        stop1: req.body.stop1,
        stop2: req.body.stop2,
        stop3: req.body.stop3,
        stop4: req.body.stop4,
        driverId: req.body.driverId
    })
    .then((ride) => {
        console.log(ride)
        res.json(ride)})
})



router.post('ride/search', async(req, res) => {
   try {
    const rides = await Ride.findAll({
        deparature: req.body.departure,
        destination: req.body.destination
    });
    res.status(200).json(rides);
    } catch(error) {
        res.status(405).json(error);
    }
});




router.get('/top', async(req, res) => {
    try {
        const topList = [];
        const allRides = await Ride.findAll({
            where: {checkedStatus: false}
        });
        let i = 0;
        while(i < allRides.length) {
            let driverIndex = allRides[i].driverId;
            let drivers = Driver.findPk(driverIndex);
            if(list.length > 0) {
                topList.push(list);
            }
            i++;
        }
        res.status(200).json({data: topList})
    }catch(error) {
        res.status(405).json(error);
    }
})



router.post('/reserve', async (req, res) => {
    const passengerId = req.body.passengerId;
    const rideId = req.body.rideId;
    let ride = await Ride.findOne({id: rideId});
    ride.addPassenger(passengerId);
  });



  router.get('/:id', async(req, res) => {
      try{
        const passengerId = req.params.id;
        const passenger = await Passenger.findPk(passengerId);
        const rides = await passenger.getRides();
        console.log(rides)
            if(rides.length){
             res.status(200).json(rides);
            }
        }catch(error) {
          res.status(500).json(error);
      }
  })


module.exports = router ;
