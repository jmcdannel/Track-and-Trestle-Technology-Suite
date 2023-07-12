import module from "./module.mts";

const COLLECTION_NAME = "locos";
const ID_FIELD = "locoId";

export default {
  getAll: (layoutId: string) => module.getAll(layoutId, COLLECTION_NAME),
  getById: (layoutId: string, locoId: string) =>
    module.getById(layoutId, locoId, ID_FIELD, COLLECTION_NAME),
  handleGetAll: ({ response, params }: any) =>
    module.handleGetAll({ response, params }, COLLECTION_NAME),
  handleGetById: ({ response, params }: any) =>
    module.handleGetById({ response, params }, params.id, ID_FIELD, COLLECTION_NAME),
};
