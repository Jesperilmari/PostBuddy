import * as React from "react";
import dayjs, { Dayjs } from "dayjs";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function DateTime(props: {
  value: Dayjs | null;
  onChange: React.Dispatch<React.SetStateAction<Dayjs | null>>;
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack spacing={2} sx={{ minWidth: 305 }}>
        <DateTimePicker
          value={props.value}
          onChange={props.onChange}
          referenceDate={dayjs()}
        />
        <Typography>
          Post set at: {props.value == null ? "null" : props.value.format()}
        </Typography>
      </Stack>
    </LocalizationProvider>
  );
}
