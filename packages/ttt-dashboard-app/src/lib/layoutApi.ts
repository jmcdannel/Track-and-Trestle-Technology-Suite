import axios from 'axios'

const baseUrl = 'https://trestle-tt-suite-ttt-app.vercel.app'
// const baseUrl = 'https://ttt-g00y7f8w0-jmcdannels-projects.vercel.app'
export async function getLayouts() {
  try {
    const { data } = await axios.get(`${baseUrl}/api/layouts`)
    return data
  } catch (err) {
    console.error(err)
    throw new Error('Unable to read layouts')
  }
}

export default {
  getLayouts,
}