import mongoose from 'mongoose';

const turnoutSchema = new mongoose.Schema({
  config: {
    interface: {
      type: String,
      required: true // Make the pointerfacert field optional
    },
    turnoutIdx: {
      type: Number,
      required: false // Make the turnoutIdx field optional
    },
    type: {
      type: String,
      required: true // Make the type field optional
    },
    divergent: {
      type: Number,
      required: false // Make the divergent field optional
    },
    straight: {
      type: Number,
      required: false // Make the straight field optional
    },
    dccExId: {
      type: Number,
      required: false // Make the dccExId field optional
    },
    servo: {
      type: Number,
      required: false // Make the servo field optional
    }
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