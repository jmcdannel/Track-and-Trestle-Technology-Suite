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
        const { params } = req.query;
        const layoutId = params?.[0];
        const effectId = params?.[1];
        console.log('effects', req.query, layoutId, effectId);
        const client = await clientPromise;
        const db = client.db('trestledb');
 
        const result = await db
            .collection('effects')
            .find({ layoutId  })
            .toArray();
            
        if (effectId) {
            const effect = result?.[0].effects.find((t: { effectId: number }) => t.effectId === parseInt(effectId));
            res.json(effect);
        } else { 
            res.json(result);
        }
 
        res.json(result);
    } catch (e) {
        console.error(e);
    }
  }
  
export default handler
