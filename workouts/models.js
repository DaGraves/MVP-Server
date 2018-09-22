'use strict';

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const WorkoutSchema = mongoose.Schema({
  date: {type: Date},
  exerciseType: {type: String},
  exerciseTime: {type: String},
  caloriesBurned: {type: String},
  notes: {type: String}
});


WorkoutSchema.virtual('formattedDate').get(function() {
  let date = new Date(this.date);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
});

WorkoutSchema.methods.serialize = function () {
  return {
    id: this._id,
    date: this.formattedDate,
    exerciseType: this.exerciseType,
    exerciseTime: this.exerciseTime,
    caloriesBurned: this.caloriesBurned,
    notes: this.notes
  };
};



const Workout = mongoose.model('Workout', WorkoutSchema);

module.exports = {Workout};

