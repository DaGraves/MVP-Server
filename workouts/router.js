'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = express.Router();

const jsonParser = bodyParser.json();
const passport = require('passport');
const {Workout} = require('./models');

const objectId = mongoose.Schema.Types.ObjectId;

const jwtAuth = passport.authenticate('jwt', {
  session: false
});

router.use(jwtAuth);

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['date', 'exerciseTime', 'type', 'notes', 'caloriesBurned'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Workout
    .create({
      date: req.body.date,
      exerciseType: req.body.exerciseType,
      exerciseTime: req.body.exerciseTime,
      caloriesBurned: req.body.caloriesBurned,
      notes: req.body.notes
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


router.get('/', jsonParser, (req, res) => {
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
          message: 'Internal server error'
        });
      });
});

router.delete('/:id', (req, res) => {
  Workout.
    findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({
      message: 'Internal server error'
    }));
});


module.exports = {router};