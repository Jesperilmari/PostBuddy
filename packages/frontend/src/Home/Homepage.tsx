import "./Home.css"
import { Button } from "@mui/material"
// import EnhancedTable from "./SecondTable"
import { useDispatch, useSelector } from "react-redux"
import { User } from "../interfaces"
import { RootState } from "../reducers/store"
import { changePage } from "../reducers/pageReducer"
import SimplePostTable from "../components/SimplePostTable"

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
    <div id="container">
      <h1 id="welcome">Welcome {user && user.name}</h1>
      <Button
        onClick={handleClick}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Create new post
      </Button>
      <SimplePostTable />
    </div>
  )
}
