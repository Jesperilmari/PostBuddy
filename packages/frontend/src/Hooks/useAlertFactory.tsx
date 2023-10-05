import { useDispatch } from "react-redux";
import { add } from "../reducers/alertReducer";

function useAlertFactory() {
  const dispatch = useDispatch();
  const info = (
    message: string,
    title?: string,
    onClose?: boolean,
    timeout?: number,
    variant?: "outlined" | "filled" | "standard"
  ) => {
    const payload = {
      severity: "info",
      message: message,
      title: title,
      onClose: onClose,
      timeout: timeout,
      variant: variant,
    };
    dispatch(add(payload));
  };
  const error = (
    message: string,
    title?: string,
    onClose?: boolean,
    timeout?: number,
    variant?: "outlined" | "filled" | "standard"
  ) => {
    const payload = {
      severity: "error",
      message: message,
      title: title,
      onClose: onClose,
      timeout: timeout,
      variant: variant,
    };
    dispatch(add(payload));
  };
  const success = (
    message: string,
    title?: string,
    onClose?: boolean,
    timeout?: number,
    variant?: "outlined" | "filled" | "standard"
  ) => {
    const payload = {
      severity: "success",
      message: message,
      title: title,
      onClose: onClose,
      timeout: timeout,
      variant: variant,
    };
    dispatch(add(payload));
  };
  const warning = (
    message: string,
    title?: string,
    onClose?: boolean,
    timeout?: number,
    variant?: "outlined" | "filled" | "standard"
  ) => {
    const payload = {
      severity: "warning",
      message: message,
      title: title,
      onClose: onClose,
      timeout: timeout,
      variant: variant,
    };
    dispatch(add(payload));
  };

  return { info, error, success, warning };
}
export default useAlertFactory;
