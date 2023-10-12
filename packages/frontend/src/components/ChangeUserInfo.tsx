import { Check, Edit, EditOff } from "@mui/icons-material"
import {
  Box,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { useEffect, useState } from "react"
import { UPDATE_USER } from "../queries"
import { useMutation } from "@apollo/client"
import useAlertFactory from "../Hooks/useAlertFactory"

type UpdateUserRes = {
  updateUser: {
    user: {
      username: string
      email: string
      name: string
    }
  }
}

export default function ChangeUserInfo() {
  const [updateUser, { data, loading, error }] =
    useMutation<UpdateUserRes>(UPDATE_USER)
  const [lastUpdated, setLastUpdated] = useState<"email" | "username" | null>(
    null
  )

  const alert = useAlertFactory()

  useEffect(() => {
    if (loading) {
      return
    }
    if (error) {
      alert.error(error.message, undefined, true)
      return
    }

    if (data && lastUpdated) {
      alert.info(
        `${lastUpdated ? lastUpdated : "User info"} changed`,
        undefined,
        true
      )
      setLastUpdated(null)
    }
  }, [data, loading, error, lastUpdated, alert])

  const changeEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get("email")
    if (!email) {
      alert.error("Please enter an email", undefined, true)
      return
    }

    updateUser({
      variables: {
        user: {
          email,
        },
      },
    })
    setLastUpdated("email")
  }

  const changeUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const username = data.get("username")
    if (!username) {
      alert.error("Please enter a name", undefined, true)
      return
    }

    updateUser({
      variables: {
        user: {
          username,
        },
      },
    })

    setLastUpdated("username")
  }

  return (
    <>
      <Stack sx={{ padding: 2 }}>
        <Typography component="p" variant="h6" gutterBottom>
          Change User Information
        </Typography>
        <TogglabbleTextField
          name="email"
          label="email"
          type="text"
          onClick={changeEmail}
        />
        <TogglabbleTextField
          name="username"
          label="username"
          type="text"
          onClick={changeUsername}
        />
      </Stack>
    </>
  )
}

type TogglabbleTextFieldProps = {
  name: string
  label: string
  type: string
  onClick: (event: React.FormEvent<HTMLFormElement>) => void
}

function TogglabbleTextField({
  name,
  label,
  type,
  onClick,
}: TogglabbleTextFieldProps) {
  const theme = useTheme()
  const [disabled, setDisabled] = useState(true)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
          }}
          component="form"
          onSubmit={onClick}
        >
          <TextField
            disabled={disabled}
            margin="normal"
            name={name}
            label={label}
            type={type}
            style={{
              backgroundColor: theme.palette.background.default,
              borderColor: theme.palette.text.disabled,
            }}
          />
          {!disabled && (
            <Box sx={{ alignSelf: "center" }}>
              <IconButton
                type="submit"
                onSubmit={() => {
                  setDisabled(!disabled)
                }}
              >
                <Check />
              </IconButton>
            </Box>
          )}
        </Box>
        {disabled ? (
          <Box sx={{ alignSelf: "center" }}>
            <IconButton
              onClick={() => setDisabled(!disabled)}
              style={{
                color: theme.palette.text.secondary,
              }}
            >
              <Edit />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ alignSelf: "center" }}>
            <IconButton
              onClick={() => setDisabled(!disabled)}
              style={{
                color: theme.palette.text.secondary,
              }}
            >
              <EditOff />
            </IconButton>
          </Box>
        )}
      </Box>
    </>
  )
}
