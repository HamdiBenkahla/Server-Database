const express = require('express');
const router= express.Router();
const {Feedback, Ride, Passenger, Driver} = require('../../database/models');

router.get('/', async(req, res) => {
 const feedback = await Feedback.findAll()
 res.json(feedback);
});


router.post('/create', async(req, res) => {
    try{
        console.log(req.body)
        const rating = Number(req.body.rating)
        const driverId = req.body.driverId;
        const driver = await Driver.findByPk(driverId)
        let newRating = (rating + (driver.rating * driver.timesRated)) / (driver.timesRated + 1);
        await Driver.increment("timesRated", {by: 1, where: {id: driverId}})
        await Driver.update({rating: newRating}, {where: {id: driverId}})
        const ride = await Ride.findByPk(rideId);
        await ride.addPassenger(passengerId, {ratedStatus: true});

        const feedback = await Feedback.create({     
        passengerId: req.body.passengerId,
        message: req.body.message,
        sender : req.body.sender,
        rideId: req.body.rideId,
        driverId: req.body.driverId
        })

        console.log(feedback)
        if(req.body.rated) {
            await Ride.update({ratedStatus: true}, { where: { id: req.body.rideId}}) 
        }
        res.json(feedback)
    }catch(error){
        res.status(500).json(error)
    }
   })


   router.get('/driver/:id',async (req,res) => {
    try {
   const driverId = Number(req.params.id); 
   const feedback = await Feedback.findAll({
       where: {
           driverId: driverId,
           sender : "passenger" 
       },order: [['createdAt', 'DESC']] ,
       include: [Passenger] 
     });
     if(feedback.length){
       res.status(200).json(feedback);
      }
  }catch(error) {
    res.status(500).json(error);
}
});

 router.get('/passenger/:id',async (req,res) => {
    try {
   const passengerId = Number(req.params.id); 
   const feedback = await Feedback.findAll({
       where: {
           passengerId: passengerId,
           sender : "driver" 
       },order: [['createdAt', 'DESC']] ,
       include: [Driver] 
     });
     if(feedback.length){
       res.status(200).json(feedback);
      }
  }catch(error) {
    res.status(500).json(error);
}
});



   module.exports = router ;