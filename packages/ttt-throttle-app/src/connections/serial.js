import axios from 'axios';

export async function send(commandType, data) {
  try {
    const resp = await axios.put(`/api/serial/${commandType}`, data);
    console.log('resp', resp);
    return resp;
  } catch (err) {
    console.error(err);
  }
}

export default {
  send
}
