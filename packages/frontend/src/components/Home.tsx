import { useEffect, useState } from "react";
import MenuAppBar from "./AppBar";
import SideNav from "./SideNav";
import { PageName, pages } from "../constants";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../reducers/store";
import { Alert, AlertTitle } from "@mui/material";
import useAlert from "../Hooks/useAlert";
import { next } from "../reducers/alertReducer";

function Home() {
  const pageString = useSelector<RootState, PageName>(
    (state) => state.page.name
  );

  const page = pages.find((page) => page.name === pageString);
  const navigate = useNavigate();
  const user = useSelector<RootState>((state) => state.user.user);
  const dispatch = useDispatch();

  const alert = useAlert();

  const [time, setTime] = useState<NodeJS.Timeout | undefined>(undefined);

  //sets timeout for alerts
  useEffect(() => {
    clearTimeout(time);
    if (alert.active) {
      setTime(
        setTimeout(() => {
          dispatch(next());
          console.log("close");
        }, 2000)
      );
    }
  }, [alert, dispatch]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const alertMessage = alert.alert.message;
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <Alert
          severity={alert.alert.severity}
          onClose={
            alert.alert.onClose
              ? () => {
                  dispatch(next());
                  console.log("close");
                }
              : undefined
          }
          variant={alert.alert.variant}
          sx={{
            display: alert.active ? "inherit" : "none",
            position: "absolute",
            minWidth: "500px",
            top: "10%",
            right: "5%",
            zIndex: 10,
          }}
        >
          {alert.alert.title ? (
            <AlertTitle>{alert.alert.title}</AlertTitle>
          ) : null}
          {alertMessage}
        </Alert>
        <MenuAppBar currentPage={pageString} />
        <section
          style={{
            display: "flex",
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          <SideNav />
          {page && page.elem}
        </section>
      </div>
    </>
  );
}

export default Home;
