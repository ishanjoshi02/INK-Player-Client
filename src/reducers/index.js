import { combineReducers } from "redux";
import user from "./UserReducer";
import videos from "./VideoReducer";

const rootReducer = combineReducers({
  user,
  videos
});

export default rootReducer;
