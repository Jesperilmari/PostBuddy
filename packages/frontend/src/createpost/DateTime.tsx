import * as React from "react"
import dayjs, { Dayjs } from "dayjs"
import Stack from "@mui/material/Stack"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import { useTheme } from "@mui/material"

export default function DateTime(props: {
  value: Dayjs | null
  onChange: React.Dispatch<React.SetStateAction<Dayjs | null>>
}) {
  const theme = useTheme()
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ minWidth: 305 }}>
        <DateTimePicker
          value={props.value}
          onChange={props.onChange}
          referenceDate={dayjs()}
          ampm={false}
          sx={{
            backgroundColor: theme.palette.background.default,
            borderColor: theme.palette.text.disabled,
            "& .MuiInputBase-input": {
              color: theme.palette.text.secondary,
            },
            "& .MuiSvgIcon-root": {
              color: theme.palette.text.secondary,
            },
          }}
        />
      </Stack>
    </LocalizationProvider>
  )
}
