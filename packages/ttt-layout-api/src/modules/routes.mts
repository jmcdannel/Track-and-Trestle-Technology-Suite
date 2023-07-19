import module from "./module.mts";

const COLLECTION_NAME = "routes";
const ID_FIELD = "routeId";

export default {
  getAll: (layoutId: string) => module.getAll(layoutId, COLLECTION_NAME),
  getById: (layoutId: string, routeId: string) =>
    module.getById(layoutId, routeId, ID_FIELD, COLLECTION_NAME),
  handleGetAll: ({ response, params }: any) =>
    module.handleGetAll({ response, params }, COLLECTION_NAME),
  handleGetById: ({ response, params }: any) =>
    module.handleGetById(
      { response, params },
      params.id,
      ID_FIELD,
      COLLECTION_NAME,
    ),
};
