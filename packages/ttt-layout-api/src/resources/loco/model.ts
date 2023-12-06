import mongoose from 'mongoose';

const locoSchema = new mongoose.Schema({
  address: Number,
  autoStop: Boolean,
  cruiseControl: Boolean,
  forward: Boolean,
  idleByDefault: Boolean,
  isAcquired: Boolean,
  maxSpeed: Number,
  name: String,
  road: String,
  speed: Number
});

const locosSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  layoutId: String,
  locos: [locoSchema]
});


export const Loco = mongoose.model('Loco', locosSchema);
