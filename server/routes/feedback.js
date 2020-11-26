const express = require('express');
const router= express.Router();
const {Feedback, Ride, Passenger, Driver} = require('../../database/models');

router.get('/', async(req, res) => {
 const feedback = await Feedback.findAll()
 res.json(feedback);
});


router.post('/create', async(req, res) => {
    try{console.log(req.body)
        const rating = req.body.rating
        const driverId = req.body.driverId;    
     await Driver.increment("rating", {by: rating, where: {id: driverId}})
     await Driver.increment("timesRated", {by: 1, where: {id: driverId}})

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
           driverId: driverId 
       } ,
       include: [Passenger] 
     });
     if(feedback.length){
       res.status(200).json(feedback);
      }
  }catch(error) {
    res.status(500).json(error);
}
});




   module.exports = router ;