import { useState } from 'react'
import { Select, Stack, MenuItem, FormControl, InputLabel, Button } from '@mui/material'

export default function TimeZoneForm() {
  const [timeFormat, setTimeFormat] = useState(24)

  return (
    <Stack spacing={1}>
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
      <Button type="submit" variant="contained" sx={{ mt: 3, mb: 2 }}>
        Update
      </Button>
    </Stack>
  )
}
