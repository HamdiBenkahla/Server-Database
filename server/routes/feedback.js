const express = require('express');
const router= express.Router();
const {Feedback, Ride, Passenger, Driver} = require('../../database/models');

router.get('/', async(req, res) => {
 const feedback = await Feedback.findAll()
 res.json(feedback);
});


router.post('/create', async(req, res) => {
    try{console.log(req.body)
   const feedback = await Feedback.create({     
       passengerId: req.body.passengerId,
       message: req.body.message,
       rideId: req.body.rideId,
       driverId: req.body.driverId
       })
       console.log(feedback)
       res.json(feedback)
    }catch(error){
     res.status(500).json(error)
    }
   })


   module.exports = router ;