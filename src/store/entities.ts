import { action, Action } from 'easy-peasy';
import { EntityList } from "../router/parseRoutes";

interface EntitiesState {
  entities: EntityList,
}

interface EntitiesActions {
  setEntities: Action<EntitiesState, EntityList>,
}

export type EntitiesStore = EntitiesActions & EntitiesState;

const entities: EntitiesStore = {
  entities: {},
  setEntities: action<EntitiesState, EntityList>((state, entities) => {
    state.entities = {
       ...entities
    };
  }),
};

export default entities;
