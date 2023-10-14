import { Container, Stack, Grid, Paper, Typography, Box } from "@mui/material"
import GeneralSettings from "./GeneralSettings"
import ChangePassword from "./ChangePassword"
import ChangeUserInfo from "./ChangeUserInfo"

export default function Settings() {
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid item lg={6} sm={12} sx={{ p: 0 }}>
          <Paper
            sx={{
              height: "100%",
            }}
            elevation={8}
          >
            <Box
              sx={{
                p: 2,
              }}
            >
              <GeneralSettings />
            </Box>
          </Paper>
        </Grid>
        <Grid item lg={4} sm={12}>
          <Stack spacing={3}>
            <Paper elevation={8}>
              <ChangeUserInfo />
            </Paper>
            <Paper elevation={8}>
              <ChangePassword />
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  )
}
