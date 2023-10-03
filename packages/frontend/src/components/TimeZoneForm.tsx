import { useState } from 'react'
import { Select, Stack, MenuItem, FormControl, InputLabel, Button } from '@mui/material'

export default function TimeZoneForm() {
  const [timeFormat, setTimeFormat] = useState(24)

  return (
    <Stack spacing={1}>
      <FormControl>
        <InputLabel id="timezone">Timezone</InputLabel>
        <Select labelId="timezone" id="timezone-select" value={123} label="Timezone">
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="time-format">Time-format</InputLabel>
        <Select
          labelId="time-format"
          id="time-format-select"
          value={timeFormat}
          label="Time-format"
          onChange={(e) => setTimeFormat(parseInt(e.target.value as string))}
        >
          <MenuItem value={12}>12H</MenuItem>
          <MenuItem value={24}>24H</MenuItem>
        </Select>
      </FormControl>
      {/* <FormControl>
        <InputLabel id="date-format">Date-format</InputLabel>
        <Select labelId="date-format" id="date-format-select" value={123} label="Date-format">
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
      </FormControl> */}
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Update
      </Button>
    </Stack>
  )
}
