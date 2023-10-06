import { FormControlLabel, FormGroup, Stack, Switch, Typography } from '@mui/material'
import Connections from './Connections'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../reducers/store'
import { ThemeState, toggle } from '../reducers/themeReducer'

export default function GeneralSettings() {
  const theme = useSelector<RootState, ThemeState>((state) => state.theme.name)
  const dispatch = useDispatch()
  const handleChange = () => {
    dispatch(toggle())
  }

  return (
    <>
      <Typography component="h2" variant="h5">
        General
      </Typography>
      <Stack spacing={2}>
        <Connections />
        <FormGroup>
          <FormControlLabel
            control={<Switch onChange={handleChange} />}
            label="Dark mode"
            checked={theme === 'dark'}
          />
        </FormGroup>
      </Stack>
    </>
  )
}
