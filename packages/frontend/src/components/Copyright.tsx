import { Link, Typography } from "@mui/material"

export default function Copyright() {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      sx={{ mt: 5 }}
    >
      {"Copyright © "}
      <Link color="inherit" href="">
        PostBuddy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  )
}
