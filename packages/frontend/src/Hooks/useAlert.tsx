import { AlertInput } from "../interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../reducers/store";

export default function useAlert() {
  return useSelector<RootState, AlertInput>((state) => state.alert);
}
