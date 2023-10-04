import { useState }  from 'react';
import './Home.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {  Alert, Button } from '@mui/material';
import EnhancedTable from './SecondTable';
import store, { RootState } from '../reducers/store';
import { useSelector } from 'react-redux';
import { User } from '../interfaces';
import { useNavigate } from 'react-router-dom';





export default function HomePage(){

    const [alert, setAlert] = useState('hidden');

    const alertMessage = 'Are you sure you want to delete the selected posts?';

    function handleClick() {
        location.href = '/createpost';
        console.log('The link was clicked.');
    }

    function handleDelete () {
        console.log('The link was clicked.');
        setAlert("visible");
        setTimeout(() => {
            setAlert("hidden");
        }, 5000);

    }

    const user = useSelector<RootState, User | undefined>((state) => state.user.user);
    //const nav = useNavigate();

    // if(!user) {
    //     console.log("not logged in")
    //     nav("/login")
    // }

    //const getAllPosts = ()=>  {}

    //props is the username

    return (

        <div id="container">
            <h1 id="welcome">Welcome {user && user.name}</h1>
            <Button 
                onClick={handleClick}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>Create new post</Button>
            <EnhancedTable></EnhancedTable>
            <Alert severity='info' sx={{visibility: alert}}>{alertMessage}</Alert>
              
        </div>
            
    )
}