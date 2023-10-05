import { createSlice } from "@reduxjs/toolkit";
import { PageName } from "../constants";
export type PageState = {
  name: PageName;
};

const initialState: PageState = {
  name: "HomePage",
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    changePage(_state, action: { payload: PageName }) {
      return {
        name: action.payload,
      };
    },
  },
});

export const { changePage } = pageSlice.actions;
export default pageSlice.reducer;
