const express = require('express');
const { where } = require('sequelize');
const router= express.Router();
const {Ride, Driver, Passenger} = require('../../database/models');
const { Op } = require("sequelize");


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
  console.log(req.body)
    const passengerId = req.body.passengerId;
    const rideId = req.body.rideId;
    let ride = await Ride.findOne({where :{id: rideId}});
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
     },
     include: [Driver]
   });
   console.log(rides)
   res.status(200).json(rides);
   } catch(error) {
       res.status(405).json(error);
   }
});

// router.post('/reserve', async (req, res) => {
//   console.log(req.body)
//   try {
//     const passengerId = req.body.passengerId;
//     const rideId = req.body.rideId;
//     console.log(rideId)
//     let ride = await Ride.findByPk(rideId);
//     let reserved = await ride.addPassenger(passengerId);
//     if(reserved) return res.json('reserved');
//   } catch(error) {
//     res.status(405).json(error);
//   }
// });

router.post('/reserve',async(req,res)=>{
  console.log(req.body);
  const ride_id = req.body.rideId;
  const passenger_id = req.body.passengerId;
  try{
    const seat = await Ride.findByPk(ride_id)
    if (seat.checkedStatus === true) return res.send({message: "no more seats for this ride"});
    if(seat.seats !== 0){
 await Ride.decrement('seats', { where: { id: ride_id }});
 console.log(ride, "here i am")
   const updated = await Ride.findByPk(ride_id)
   if(updated.seats === 0){
   await Ride.update({ checkedStatus : true })	
     }
   res.status(200).json('place is reserved!')
  }
  }catch(error){
   res.status(405).json(error)
  }
})


router.get('/:id', async(req, res) => {
  try{
    console.log(req.params)
    const passengerId = Number(req.params.id);
    const passenger = await Passenger.findByPk(passengerId);
    const rides = await passenger.getRides();
    console.log(rides)
        if(rides.length){
         res.status(200).json(rides);
        }
    }catch(error) {
      res.status(500).json(error);
  }
})


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
    const driverId = Number(req.params.id); 
    const rides = await Ride.findAll({
        where: {
          [Op.and]: [
            { driverId: driverId },
            { checkedStatus: false }
          ]
        }
      });
        res.json(rides) 
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
