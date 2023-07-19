import module from "./module.mts";

const COLLECTION_NAME = "turnouts";
const ID_FIELD = "turnoutId";

export default {
  getAll: (layoutId: string) => module.getAll(layoutId, COLLECTION_NAME),
  getById: (layoutId: string, turnoutId: string) =>
    module.getById(layoutId, parseInt(turnoutId), ID_FIELD, COLLECTION_NAME),
  handleGetAll: ({ response, params }: any) =>
    module.handleGetAll({ response, params }, COLLECTION_NAME),
  handleGetById: ({ response, params }: any) =>
    module.handleGetById(
      { response, params },
      parseInt(params.id),
      ID_FIELD,
      COLLECTION_NAME,
    ),
};
