import { FormControlLabel, FormGroup, Stack, Switch, Typography } from '@mui/material'
import Connections from './Connections'
import TimeZoneForm from './TimeZoneForm'

export default function GeneralSettings() {
  return (
    <>
      <Typography component="h2" variant="h5">
        General
      </Typography>
      <Stack spacing={2}>
        <Connections />
        <FormGroup>
          <FormControlLabel control={<Switch />} label="Dark mode" />
        </FormGroup>
        <TimeZoneForm />
      </Stack>
    </>
  )
}
