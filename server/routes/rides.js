const express = require('express');
const { where } = require('sequelize');
const router= express.Router();
const {Ride} = require('../../database/models');
const ride = require('../../database/models/ride');
const db = require("../../database/models/ride");
// const { Model } = require('sequelize/types');
// const { QueryTypes} = require('sequelize');
// const { object } = require('joi');

// Ride.create()
router.get('/', async(req, res) => {
    await Ride.findAll().then((passenger) => res.json(passenger))
});


router.get('/ride', async(req, res) => {
    await Ride.findOne({where: {date: req.body.date}}).then((ride) => res.json(ride))
});


// router.post('/', async(req, res) => {
//     await Ride.create({
//         departure: req.body.deparature,
//         destination: req.body.destination,
//         time: req.body.time,
//         date: req.body.date,
//         price: req.body.price,
//         seats: req.body.seats,
//         stop1: req.body.stop1,
//         stop2: req.body.stop2,
//         stop3: req.body.stop3,
//         stop4: req.body.stop4,
//         driverId: req.driverId
//     })
//     .then((ride) => res.json(ride))
// })


router.post("/reserve/add", async (req, res) => {
    const passengerId = req.body.passengerId;
    const rideId = req.body.rideId;
    let ride = await Ride.findOne({id: rideId});
    ride.addPassenger(passengerId);
  });


//   const ride = await Passenger.create({ id: passengerId });
//   await user.addRide([ride,RidePassengers]);
//   const appointment = await sequelize.query(`INSERT INTO RidePassenger(rideId,passengerId) VALUES("${rideId}","${passengerId}"`, { type: QueryTypes.INSERT});
  
router.post('/search', async(req, res) => {
  try {
   const rides = await Ride.findAll({
     where: {
       departure: req.body.departure,
       destination: req.body.destination
     }
      
   });
   res.status(200).json(rides);
   } catch(error) {
       res.status(405).json(error);
   }
});

router.post('/reserve', async (req, res) => {
  try {
    const passengerId = req.body.passengerId;
    const rideId = req.body.rideId;
    let ride = await Ride.findByPk(rideId);
    let reserved = await ride.addPassenger(passengerId);
    if(reserved) return res.json('reserved');
  } catch(error) {
    res.status(405).json(error);
  }
});




//basma
//will insert a new row in the rides table
router.post('/create', async(req, res) => {
    try{console.log(req.body)
   const ride = await Ride.create({
     
       departure: req.body.departure,
       destination: req.body.destination,
       date: req.body.date,
       time: req.body.time,
       seats: req.body.seats,
       price: req.body.price,
       checkedStatus: false,
       stop1: req.body.stop1,
       stop2: req.body.stop2,
       stop3: req.body.stop3,
       stop4: req.body.stop4,
       driverId: req.body.driverId
       })
       console.log(ride)
       res.json(ride)
    }catch(error){
     res.status(500).json(error)
    }
   })

  //  1 - making an empty memory array to put the filtred data in it
  //  2 - getting all the rides from ride table by driver id
  //  3 - filter the data from database where checkedStatus is false
  //  4 - send the response to the front end in an object where the key is data
  //    find() for any field
   router.get('/:id',async (req,res) => {
    // console.log(result)
    const result = [];
    const driverId = req.params.id; 
    // e.g Ride.find({where: {driverId: 2}}) WHERE DRIVERiD IS THE FORGIN
    const rides = await Ride.findAll({
        where: {
          [Op.and]: [
            { driverId: driverId },
            { checkedStatus: false }
          ]
        }
      });
          if(rides.length === 0) return res.status(204).json({data: []});
    
        res.json({data: result}) 
});

// router.post('/reserve',async(req,res)=>{
//   console.log(maxSeats)
//   ride = await Ride.Update({
//     where: {
//       [Op.and]: [
//         {maxSeats: req.body.maxSeats},
//         { checkedStatus: true }
//       ]
//     }
//   });
//   res.json({maxSeats}) 
// })


//updating the number of seats every time a passenger reserves
router.post('/ride/reserve',async(req,res)=>{
  const seat_id = req.body.seatId;
  const driver_id = req.body.driverId;
  const passenger_id = req.body.passengerId;
  try{
    const seat = await Ride.findPk(seat_id)
    if(seat.seats < 5){
   await Ride.increment({seats: +1, where:{
                [Op.and]: [
                  {driverId: driver_id },
                  { passengerId : passenger_id }
                ]
              }
              });
   const updated = await Ride.findPk(seat_id)
   if(updated.seats === 4){
   await Ride.update({ checkStatus : true })	
     }
   res.status(200).json('place is reserved!')
  }
  }catch(error){
   res.status(405).json(error)
  }
})
   

  


module.exports = router ;
