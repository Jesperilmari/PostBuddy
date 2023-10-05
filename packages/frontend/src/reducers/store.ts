import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import userReducer from "./userReducer";
import { User } from "../interfaces";
import alertReducer from "./alertReducer";
import pageReducer from "./pageReducer";
import { PageName } from "../constants";

const rootReducer = combineReducers({
  user: userReducer,
  alert: alertReducer,
  page: pageReducer,
});

export type RootState = {
  user: {
    user?: User;
    token?: string;
  };
  alert: {
    active: boolean;
    alert: {
      severity: "success" | "info" | "warning" | "error";
      message?: string | "alert";
      title: string | null;
      onClose: boolean;
      timeout: number;
      outlined: boolean;
      filled: boolean;
    };
  };
  page: {
    name: PageName;
  };
};

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk], // TODO: dunno if needed?
});

export default store;
