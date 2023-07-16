import db from "../conn.mts";

export async function getAll(layoutId: string, collectionName = 'layouts') {
  console.log("[MODULE] getAll", layoutId, collectionName);
  const results = await db?.collection(collectionName)?.find({ layoutId })
    .toArray();
  return results;
}

export async function getById(
  layoutId: string, 
  id: any, 
  idField: string, 
  collectionName: string
  ) {
  try {
    const query = {
      "$match": {
        layoutId,
        [`${collectionName}.${idField}`]: id,
      },
    };
    console.log('getById', query);
    const projection = {
      "$project": {
        "obj": {
          $filter: {
            input: `$${collectionName}`,
            as: "obj",
            cond: { $eq: [`$$obj.${idField}`, id] },
          },
        },
        _id: 0,
      },
    };
    const result = await db?.collection(collectionName)?.aggregate([
      query,
      projection,
    ]).toArray();
    console.log('getById', result, collectionName, query);
    return result?.[0]?.["obj"]?.[0];
  } catch (e) {
    console.error(e);
  }
}

export async function handleGetAll({ response, params }: any, collectionName: string) {
  console.log("[MODULE] handleGetAll", collectionName);
  response.type = "application/json";
  response.body = await getAll(params.layoutId, collectionName);
}

export async function handleGetById(
  { response, params }: any,
  id: any,
  idField: string,
  collectionName: string,
) {
  console.log("[MODULE] handleGetById", params, id, idField, collectionName);
  response.type = "application/json";
  response.body = await getById(
    params.layoutId,
    id,
    idField,
    collectionName,
  );
}

export default {
  getAll,
  getById,
  handleGetAll,
  handleGetById,
};
