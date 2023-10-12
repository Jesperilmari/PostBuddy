import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material"
import { CHANGE_PASSWORD } from "../queries"
import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import useAlertFactory from "../Hooks/useAlertFactory"

type ChangePasswordRes = {
  changePassword: {
    user: {
      id: string
      username: string
      email: string
      name: string
    }
  }
}

export default function ChangePassword() {
  const theme = useTheme()
  const [changePassword, { data, loading, error }] =
    useMutation<ChangePasswordRes>(CHANGE_PASSWORD)
  const [submitted, setSubmitted] = useState(false)
  const alert = useAlertFactory()

  useEffect(() => {
    if (loading || submitted) {
      return
    }

    setSubmitted(true)
    if (error) {
      alert.error(error.message, undefined, true)
      return
    }

    if (data) {
      alert.success("Password changed", undefined, true)
    }
  }, [loading, error, data, submitted, alert])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(false)
    const data = new FormData(e.currentTarget)
    const ok = checkData(data)
    if (ok) {
      changePassword({
        variables: {
          oldPassword: data.get("old"),
          newPassword: data.get("new"),
        },
      })
    }
  }

  return (
    <>
      <Box
        sx={{ padding: 2 }}
        component="form"
        noValidate
        onSubmit={handleSubmit}
      >
        <Typography component="p" variant="h6" gutterBottom>
          Change Password
        </Typography>
        <TextField
          margin="normal"
          required
          name="old"
          label="old"
          type="password"
          style={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.text.disabled,
          }}
        />
        <TextField
          margin="normal"
          required
          name="new"
          label="new"
          type="password"
          style={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.text.disabled,
          }}
        />
        <TextField
          margin="normal"
          required
          name="repeat"
          label="repeat"
          type="password"
          style={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.text.disabled,
          }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Change password
        </Button>
      </Box>
    </>
  )
}

function checkData(data: FormData) {
  const old = data.get("old")
  const newPassword = data.get("new")
  const repeat = data.get("repeat")
  if (!old || !newPassword || !repeat) {
    alert("Please fill in all fields")
    return false
  }

  if (newPassword !== repeat) {
    alert("Passwords do not match")
    return false
  }
  return true
}
