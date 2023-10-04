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

  useEffect(() => {
    if (loading) {
      return
    }
    if (error) {
      alert(error.message)
      return
    }

    if (data && lastUpdated) {
      alert(`${lastUpdated ? lastUpdated : "User info"} changed`)
      setLastUpdated(null)
    }
  }, [data, loading, error, lastUpdated])

  const changeEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get("email")
    if (!email) {
      alert("Please enter an email")
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
      alert("Please enter a name")
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
              <IconButton type="submit" onClick={() => setDisabled(true)}>
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
              onClick={onClick}
              style={{
                color: theme.palette.text.secondary,
              }}
            >
              <Check />
            </IconButton>
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
