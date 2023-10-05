import "./Home.css";
import { Button } from "@mui/material";
import EnhancedTable from "./SecondTable";
import { useSelector } from "react-redux";
import { User } from "../interfaces";
import { useNavigate } from "react-router-dom";
import { RootState } from "../reducers/store";

export default function HomePage() {
  function handleClick() {
    //TODO: redirect to create post page
    console.log("The link was clicked.");
  }

  const user = useSelector<RootState, User | undefined>(
    (state) => state.user.user
  );
  const nav = useNavigate();

  if (!user) {
    console.log("not logged in");
    nav("/login");
  }
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
      <EnhancedTable></EnhancedTable>
    </div>
  );
}
