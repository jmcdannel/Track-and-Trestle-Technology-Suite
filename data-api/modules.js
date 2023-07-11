import db from './db.js';

export async function getAll(layoutId, collectionName = 'layouts') {
  console.log('[MODULE] getAll', layoutId, collectionName);
  const results = await db.collection(collectionName).find({ layoutId }).toArray();
  return results;
}

export async function getById(layoutId, id, idField, collectionName) {
  try {
    let result;
    if (collectionName === 'layouts') {
      result = await db.collection('layouts').find({ layoutId }).toArray();
      return result?.[0];
    } else {
      const query = (idField && collectionName) 
      ? { 
          "$match" : {
            [`${collectionName}.${idField}`]: id 
          }
        }
      : {};
      const projection = (idField && collectionName) 
      ? { 
          "$project": {
            "obj": {
              $filter: {
                input: `$${collectionName}`,
                as: 'obj',
                cond: {$eq: [`$$obj.${idField}`, id]}
              }
            },
            _id: 0
          }
        }
      : {};
      result = await db.collection(collectionName).aggregate( [ query, projection ]).toArray();
      return result?.[0]?.['obj']?.[0];
    }
  } catch(e) {
    console.error(e);
  }
}

export async function handleGetAll({ response, params }, collectionName) {
  console.log('[MODULE] handleGetAll', collectionName);
  response.type = "application/json";
  response.body = await getAll(params.layoutId, collectionName);
}

export async function handleGetById({ response, params }, id, idField, collectionName) { 
  console.log('[MODULE] handleGetById', params, id, idField, collectionName);
  response.type = "application/json";
  response.body = await getById(params.layoutId, parseInt(id), idField, collectionName);
}

export const locos = (() => {
  const COLLECTION_NAME = 'locos';
  const ID_FIELD = 'locos';
  return {
    getAll: (layoutId) => module.getAll(layoutId, COLLECTION_NAME),
    getById:(layoutId, effectId) =>  module.getById(layoutId, effectId, ID_FIELD, COLLECTION_NAME),
    handleGetAll: ({ response, params }) => module.handleGetAll({ response, params }, COLLECTION_NAME),
    handleGetById: ({ response, params }) => module.handleGetById({ response, params }, params.id, ID_FIELD, COLLECTION_NAME)
  }
})();

export const effects = (() => {
  const COLLECTION_NAME = 'effects';
  const ID_FIELD = 'effectId';
  return {
    getAll: (layoutId) => module.getAll(layoutId, COLLECTION_NAME),
    getById:(layoutId, effectId) =>  module.getById(layoutId, effectId, ID_FIELD, COLLECTION_NAME),
    handleGetAll: ({ response, params }) => module.handleGetAll({ response, params }, COLLECTION_NAME),
    handleGetById: ({ response, params }) => module.handleGetById({ response, params }, params.id, ID_FIELD, COLLECTION_NAME)
  }
})();

export const layouts = (() => {
  const COLLECTION_NAME = 'layouts';
  const ID_FIELD = 'layoutId';
  return {
    getAll: (layoutId) => module.getAll(layoutId, COLLECTION_NAME),
    getById:(layoutId, effectId) =>  module.getById(layoutId, effectId, ID_FIELD, COLLECTION_NAME),
    handleGetAll: ({ response, params }) => module.handleGetAll({ response, params }, COLLECTION_NAME),
    handleGetById: ({ response, params }) => module.handleGetById({ response, params }, params.id, ID_FIELD, COLLECTION_NAME)
  }
})();

export const turnouts = (() => {
  const COLLECTION_NAME = 'turnouts';
  const ID_FIELD = 'turnoutId';
  return {
    getAll: (layoutId) => module.getAll(layoutId, COLLECTION_NAME),
    getById:(layoutId, effectId) =>  module.getById(layoutId, effectId, ID_FIELD, COLLECTION_NAME),
    handleGetAll: ({ response, params }) => module.handleGetAll({ response, params }, COLLECTION_NAME),
    handleGetById: ({ response, params }) => module.handleGetById({ response, params }, params.id, ID_FIELD, COLLECTION_NAME)
  }
})();

export const routes = (() => {
  const COLLECTION_NAME = 'routes';
  const ID_FIELD = 'routeId';
  return {
    getAll: (layoutId) => module.getAll(layoutId, COLLECTION_NAME),
    getById:(layoutId, effectId) =>  module.getById(layoutId, effectId, ID_FIELD, COLLECTION_NAME),
    handleGetAll: ({ response, params }) => module.handleGetAll({ response, params }, COLLECTION_NAME),
    handleGetById: ({ response, params }) => module.handleGetById({ response, params }, params.id, ID_FIELD, COLLECTION_NAME)
  }
})();

export default {
  getAll,
  getById,
  handleGetAll,
  handleGetById,
  effects,
  layouts,
  locos,
};