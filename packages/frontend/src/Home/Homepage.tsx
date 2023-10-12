import "./Home.css"
import { Box, Button, Container, Typography } from "@mui/material"
// import EnhancedTable from "./SecondTable"
import { useDispatch, useSelector } from "react-redux"
import { User } from "../interfaces"
import { RootState } from "../reducers/store"
import { changePage } from "../reducers/pageReducer"
import SentPostTable from "../components/SentPostTable"
import PendingPostTable from "../components/PendingPostTable"

export default function HomePage() {
  const dispatch = useDispatch()

  function handleClick() {
    dispatch(changePage("Create post"))
    console.log("The link was clicked.")
  }

  const user = useSelector<RootState, User | undefined>(
    (state) => state.user.user
  )

  //const getAllPosts = ()=>  {}
  //const getAllPosts = ()=>  {}

  //props is the username

  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        Welcome {user && user.name}
      </Typography>
      <Button
        onClick={handleClick}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 4 }}
      >
        Create new post
      </Button>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "4rem",
        }}
      >
        <Box>
          <Typography component="h2" variant="h4" gutterBottom>
            Pending posts
          </Typography>
          <PendingPostTable />
        </Box>
        <Box>
          <Typography component="h2" variant="h4" gutterBottom>
            Sent posts
          </Typography>
          <SentPostTable />
        </Box>
      </Box>
    </Container>
  )
}
