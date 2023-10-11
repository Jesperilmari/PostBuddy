import { Check, Edit, EditOff } from '@mui/icons-material'
import { Box, IconButton, Stack, TextField, Typography, useTheme } from '@mui/material'
import { useState } from 'react'

export default function ChangeUserInfo() {
  return (
    <>
      <Stack sx={{ padding: 2 }}>
        <Typography component="p" variant="h6" gutterBottom>
          Change User Information
        </Typography>
        <TogglabbleTextField 
        name="Email" 
        label="email" 
        type="text"
        onClick={() => {}} />
        <TogglabbleTextField name="Username" label="username" type="text" onClick={() => {}} />
      </Stack>
    </>
  )
}

type TogglabbleTextFieldProps = {
  name: string
  label: string
  type: string
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

function TogglabbleTextField({ name, label, type, onClick }: TogglabbleTextFieldProps) {
  const theme = useTheme()
  const [disabled, setDisabled] = useState(true)
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <TextField 
        disabled={disabled} 
        margin="normal" 
        name={name} 
        label={label} 
        type={type} 
        style={{
          backgroundColor: theme.palette.background.default,
          borderColor: theme.palette.text.disabled,}}/>

        {disabled ? (
          <Box sx={{ alignSelf: 'center' }}>
            <IconButton onClick={() => setDisabled(!disabled)}
            style={{
              color: theme.palette.text.secondary
            }}>
              <Edit />
            </IconButton>
          </Box>
        ) : (
          <Box sx={{ alignSelf: 'center' }}>
            <IconButton onClick={onClick}
            style={{
              color: theme.palette.text.secondary
            }}>
              <Check />
            </IconButton>
            <IconButton onClick={() => setDisabled(!disabled)}
            style={{
              color: theme.palette.text.secondary
            }}>
              <EditOff />
            </IconButton>
          </Box>
        )}
      </Box>
    </>
  )
}
