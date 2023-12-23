import axios from 'axios';

const com = {}
const payload = {
  "start": 0,
  "end": 99,
  "command": "color",
  "config": {
    "r": 200,
    "g": 0,
    "b": 50
  }
}
const uri = 'http://192.168.86.47/led';

com.send = async (uri, data) => {
  try {
    console.log('[IALED]', uri, JSON.stringify(data));
    const resp = await axios.post(uri, JSON.stringify(data));
    return resp?. data;
  } catch (err) {
    console.error('[IALED ERROR]', uri, err?.message, JSON.stringify(data));
  }
};

com.send(uri, payload);

