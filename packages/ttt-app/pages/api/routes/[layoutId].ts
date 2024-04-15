import Cors from 'cors'
import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from 'next';

// Initializing the cors middleware
const cors:any = Cors({
    methods: ['GET', 'HEAD'],
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req:any, res:any, fn:any) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result:any) => {
        if (result instanceof Error) {
            return reject(result)
        }

        return resolve(result)
        })
    })
}

async function handler(req:NextApiRequest, res:NextApiResponse) {
    // Run the middleware
    await runMiddleware(req, res, cors)
  
    // Rest of the API logic
    try {
        console.log('turnouts', req.query);
        const { layoutId } = req.query
        const client = await clientPromise;
        const db = client.db('trestledb');
 
        const layouts = await db
            .collection('routes')
            .find({ layoutId  })
            .toArray();
 
        res.json(layouts);
    } catch (e) {
        console.error(e);
    }
  }
  
export default handler
