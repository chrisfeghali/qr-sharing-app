import { combineReducers } from "redux";
import firebase from "./firebaseReducer.js";

const rootReducer = combineReducers({
  firebase,
});

export default rootReducer;
