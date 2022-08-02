import { ForeignKeyGetterType } from "../EntityInterface";
import { StoreContainer } from "../../store";
import autoSelectOptions from "./AutoSelectOptions";

const foreignKeyGetter: ForeignKeyGetterType = async ({
    cancelToken,
    entityService,
  }): Promise<any> => {
    const response: Record<string, Array<string | number> | undefined> = {};

    const entities = StoreContainer.store.getState().entities.entities;
    const promises = autoSelectOptions({
      entities,
      entityService,
      cancelToken,
      response,
    });

    await Promise.all(promises);

    return response;
};


export default foreignKeyGetter;