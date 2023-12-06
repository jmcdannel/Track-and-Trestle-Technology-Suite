import mongoose from 'mongoose';

const turnoutSchema = new mongoose.Schema({
  turnoutId: {
    type: Number,
    required: true
  },
  state: {
    type: Boolean,
    required: true
  }
});

const destinationSchema = new mongoose.Schema({
  name: String,
  routeId: Number,
  line: String,
  svdId: String
});

const pathsSchema = new mongoose.Schema({
  destinations: {
    type: [Number],
    required: true
  },
  turnouts: {
    type: [turnoutSchema],
    required: true
  }
});

const routesSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  layoutId: String,
  destinations: [destinationSchema],
  paths: [pathsSchema]
});

export const Route = mongoose.model('Route', routesSchema);
