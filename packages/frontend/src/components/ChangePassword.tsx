import { Button, Stack, TextField, Typography, useTheme } from '@mui/material'

export default function ChangePassword() {
  const theme = useTheme()
  return (
    <>
      <Stack sx={{ padding: 2 }}>
        <Typography component="p" variant="h6" gutterBottom>
          Change Password
        </Typography>
        <TextField 
        margin="normal" 
        required name="Previous password" 
        label="old" type="password" style={{
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.text.disabled,}} />
        <TextField 
        margin="normal" 
        required name="New password" 
        label="new" 
        type="password"
        style={{
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.text.disabled,}} />
        <TextField
          margin="normal"
          required
          name="Repeat new password"
          label="repeat"
          type="password"
          style={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.text.disabled,}}
        />
        <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
          Change password
        </Button>
      </Stack>
    </>
  )
}
