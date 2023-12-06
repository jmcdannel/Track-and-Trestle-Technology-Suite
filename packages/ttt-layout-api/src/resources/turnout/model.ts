import mongoose from 'mongoose';

const turnoutSchema = new mongoose.Schema({
  config: {
    interface: String,
    turnoutIdx: Number,
    type: String,
    divergent: Number,
    straight: Number,
    dccExId: Number,
    servo: Number
  },
  name: String,
  state: Boolean,
  turnoutId: Number
});

const turnoutsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  layoutId: String,
  turnouts: [turnoutSchema]
});
export const Turnout = mongoose.model('Turnout', turnoutsSchema);