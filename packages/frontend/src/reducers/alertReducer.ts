import { Stack } from "../stack";
import { createSlice } from "@reduxjs/toolkit";

const table = new Stack<AlertState>();

export type AlertState = {
  readonly active: boolean;
  readonly alert: {
    readonly severity: "success" | "info" | "warning" | "error";
    readonly message?: string | "alert";
    readonly title: string | null;
    readonly onClose: boolean;
    readonly timeout: number;
    readonly variant: "outlined" | "filled" | "standard";
  };
};

const initialState: AlertState = {
  active: false,
  alert: {
    severity: "info",
    message: "empty alert",
    title: null,
    onClose: false,
    timeout: 5000,
    variant: "standard",
  },
};

const alertSlsice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    next() {
      if (!table.isEmpty()) {
        table.pop();
        if (!table.isEmpty()) {
          return table.peek();
        }
        return initialState;
      }
      console.log(initialState);
      return initialState;
    },
    disabled() {
      return { ...initialState };
    },
    add(_state, action) {
      const { message, title, onClose, timeout, variant, severity } =
        action.payload;
      table.push({
        active: true,
        alert: {
          severity,
          message,
          title,
          onClose,
          timeout,
          variant,
        },
      });
      return table.peek();
    },
  },
});

export const { add, disabled, next } = alertSlsice.actions;
export default alertSlsice.reducer;
