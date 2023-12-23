import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const interfaceSchema = new mongoose.Schema({
  id: String,
  type: String,
  config: {
    baud: {
      type: Number,
      required: false // Make the baud field optional
    },
    port: {
      type: String,
      required: false // Make the port field optional
    },
    protocol: {
      type: String,
      required: false // Make the protocol field optional
    },
    serial: {
      type: String,
      required: false // Make the serial field optional
    }
  }
});

const layoutSchema = new Schema({
  layoutId: String,
  name: String,
  modules: [String]
});

export const Layout = mongoose.model('Layout', layoutSchema);