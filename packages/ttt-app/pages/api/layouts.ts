import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
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
};