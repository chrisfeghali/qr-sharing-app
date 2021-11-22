import * as types from "../actions/actionTypes";

export default function firebaseReducer(state = {}, action) {
  switch (action.type) {
    case types.INIT_FIREBASE:
      console.log(`Firebase Init`);
      return state;
    default:
      return state;
  }
}
