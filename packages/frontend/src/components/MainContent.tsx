import { useEffect, useState } from "react"
import MenuAppBar from "./AppBar"
import SideNav from "./SideNav"
import { PageName, pages } from "../constants"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../reducers/store"
import { Alert, AlertTitle, Box } from "@mui/material"
import useAlert from "../Hooks/useAlert"
import { next } from "../reducers/alertReducer"
import { User } from "../interfaces"
import { useQuery } from "@apollo/client"
import { ME } from "../queries"
import { userLoggedIn } from "../reducers/userReducer"

// TODO scary skeletons when loading stuff

function MainContent() {
  const pageString = useSelector<RootState, PageName>(
    (state) => state.page.name
  )

  const page = pages.find((page) => page.name === pageString)
  const navigate = useNavigate()
  const token = useSelector<RootState, string | undefined>(
    (state) => state.user.token
  )
  const dispatch = useDispatch()
  const { data, loading, error, refetch } = useQuery<{ me: User }>(ME)

  const alert = useAlert()

  if (!token) {
    navigate("/login")
  }

  // If we have the token but not user data, refetch
  const user = useSelector<RootState, User | undefined>(
    (state) => state.user.user
  )
  if (!user) {
    refetch()
  }

  useEffect(() => {
    if (loading) {
      return
    }
    if (error) {
      navigate("/login")
      return
    }

    if (data) {
      dispatch(
        userLoggedIn({
          user: data.me,
          token: token,
        })
      )
    }
  }, [data, loading, error, navigate, dispatch, token])

  const [time, setTime] = useState<NodeJS.Timeout | undefined>(undefined)

  //sets timeout for alerts
  useEffect(() => {
    clearTimeout(time)
    if (alert.active) {
      setTime(
        setTimeout(() => {
          dispatch(next())
        }, alert.alert.timeout || 5000)
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alert, dispatch])

  const alertMessage = alert.alert.message
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Alert
          severity={alert.alert.severity}
          onClose={
            alert.alert.onClose
              ? () => {
                  dispatch(next())
                  console.log("close")
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
            flexDirection: "row",
          }}
        >
          <SideNav />
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {page && page.elem}
          </Box>
        </section>
      </div>
    </>
  )
}

export default MainContent
