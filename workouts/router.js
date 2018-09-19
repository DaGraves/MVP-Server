'use strict';
const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const {Workout} = require('./models');

const router = express.Router();

const jsonParser = bodyParser.json();

const passport = require('passport');

const objectId = mongoose.Schema.Types.ObjectId;


//protect routes
const jwtAuth = passport.authenticate('jwt', {
  session: false
});

router.use(jwtAuth);


//==========================
//         CREATE
//==========================


//+++++++++++++++++++++++++++++++++++++
// ADD NEW WORKOUT -- *** WORKS IN POSTMAN ***
//++++++++++++++++++++++++++++++++++++

router.post("/", jsonParser, (req, res) => {
  const requiredFields = ['name', 'date', 'exerciseTime', 'type', 'notes', 'caloriesBurned'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!field in req.body) {
      const message = `Missing \`${field}\` in request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Workout
    .create({
      name: req.body.name,
      date: req.body.date,
      exerciseTime: req.body.exerciseTime,
      exerciseType: req.body.exerciseType,
      notes: req.body.notes,
      caloriesBurned: req.body.caloriesBurned
    })
    .then(
      workouts => res.status(200).json(workouts.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({
        message: 'Internal server error'
      });
    });

});

      //==========================
      //          READ
      //==========================


      //++++++++++++++++++
      // GET ALL WORKOUTS *** WORKS IN POSTMAN ***
      //+++++++++++++++++

      router.get("/", jsonParser, (req, res) => {
        Workout
          .find()
          .then(workouts => {
            res.json({
              workouts: workouts.map((workout) => workout.serialize())
            });
          })
          .catch(
            err => {
              console.error(err);
              res.status(500).json({
                message: "Internal server error"
              });
            });
      });

      //==========================
      //         DESTROY
      //==========================


      //++++++++++++++++++++
      // DELETE EXISTING WORKOUT *** WORKS IN POSTMAN ***
      //+++++++++++++++++++


      router.delete("/:id", (req, res) => {
        Workout.
        findByIdAndRemove(req.params.id)
          .then(() => res.status(204).end())
          .catch(err => res.status(500).json({
            message: 'Internal server error'
          }));
      });


      module.exports = {router};