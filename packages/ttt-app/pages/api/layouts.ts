import Cors from 'cors'
import clientPromise from "../../lib/mongodb";


// Initializing the cors middleware
const cors = Cors({
methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
        if (result instanceof Error) {
            return reject(result)
        }

        return resolve(result)
        })
    })
}

async function handler(req, res) {
    // Run the middleware
    await runMiddleware(req, res, cors)
  
    // Rest of the API logic
    try {
        const client = await clientPromise;
        const db = client.db('trestledb');
 
        const layouts = await db
            .collection('layouts')
            .find({})
            .toArray();
 
        res.json(layouts);
    } catch (e) {
        console.error(e);
    }
  }
  
export default handler
