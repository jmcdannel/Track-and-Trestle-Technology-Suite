import mongoose from 'mongoose';

const effectSchema = new mongoose.Schema({
  config: {
    interface: String,
    pin: Number,
    file: String,
    start: Number,
    end: Number,
    command: String
  },
  effectId: Number,
  name: String,
  state: Number,
  type: String
});

const effectsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  layoutId: String,
  effects: [effectSchema]
});

export const Effect = mongoose.model('Effect', effectsSchema);
