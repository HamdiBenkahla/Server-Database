const express = require('express');
const router= express.Router();
const {Ride, Driver, Passenger} = require('../../database/models');
const { Op, literal } = require("sequelize");


// Ride.create()
router.get('/', async(req, res) => {
    await Ride.findAll().then((passenger) => res.json(passenger))
});


router.get('/ride', async(req, res) => {
    await Ride.findOne({where: {date: req.body.date}}).then((ride) => res.json(ride))
});


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
    const passengerId = req.body.passengerId;
    console.log(req.body)
    const passenger = await Passenger.findByPk(passengerId);
    console.log(passenger)
    const myRides = await passenger.getRides();
    console.log(myRides)
    const rides = await Ride.findAll({
      where: {
        departure: req.body.departure,
        destination: req.body.destination,
        checkedStatus: false
      },
      include: [Driver]
    });
    // console.log(rides);
    const searchedRides = [];
    for(var i = 0; i < rides.length; i++) {
      for(var j = 0; j < myRides.length; j++) {
        if(rides[i].id === myRides[j].id) {break;}
      }
      if(j === myRides.length) {searchedRides.push(rides[i]);}
    }
    console.log(searchedRides)
    res.status(200).json(searchedRides);
    } catch(error) {
        res.status(405).json(error);
    }
});


router.post('/reserve',async(req,res)=>{ 
  try{
    console.log(req.body);
  const rideId = req.body.rideId;
  const passengerId = req.body.passengerId;
    
  await Ride.decrement('seats', { where: { id: rideId }});
  await Ride.update({ checkedStatus: true}, { where: { id: rideId, seats: 0 }})
      const ride = await Ride.findByPk(rideId)
      console.log(ride);
      let reserved = await ride.addPassenger(passengerId);
          if(reserved) return res.json('reserved');
        } catch(error) {
          res.status(405).json(error);
        }
})


router.get('/passenger/:id', async(req, res) => {
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

router.get('/passengers/:id', async(req, res) => {
  try{
    const rideId = Number(req.params.id);
    const ride = await Ride.findByPk(rideId);
    const passengers = await ride.getPassengers();
    console.log(passengers);
    if(passengers.length) {
      res.status(200).json(passengers);
    }
  } catch(error) {
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
   router.get('/driver/:id',async (req,res) => {
     try {
    const driverId = Number(req.params.id); 
    const rides = await Ride.findAll({
        where: {
            driverId: driverId,
            ratedStatus: false
        }
      });
      if(rides.length){
        res.status(200).json(rides);
       }
   }catch(error) {
     res.status(500).json(error);
 }
});


module.exports = router ;
