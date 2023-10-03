import { Button, Stack, TextField, Typography } from '@mui/material'

export default function ChangePassword() {
  return (
    <>
      <Stack sx={{ padding: 2 }}>
        <Typography component="p" variant="h6" gutterBottom>
          Change Password
        </Typography>
        <TextField margin="normal" required name="Previous password" label="old" type="password" />
        <TextField margin="normal" required name="New password" label="new" type="password" />
        <TextField
          margin="normal"
          required
          name="Repeat new password"
          label="repeat"
          type="password"
        />
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Change password
        </Button>
      </Stack>
    </>
  )
}
