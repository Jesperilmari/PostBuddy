import { useState }  from 'react';
import './Home.css';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import {  Alert, Button } from '@mui/material';
import EnhancedTable from './SecondTable';





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

    //const getAllPosts = ()=>  {}

    //props is the username
    const name = 'user';
    return (

        <div id="container">
            <h1 id="welcome">Welcome {name}</h1>
            <Button 
                onClick={handleClick}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}>Create new post</Button>
            <EnhancedTable></EnhancedTable>
            <Button 
                id='deleteButton'
                color='warning'
                onClick={handleDelete}
                fullWidth
                variant="contained"
                sx={{width: "20%", mt: 3, mb: 2, p: 0}}
                >
                <DeleteForeverIcon id="deleteIcon"/><p id="deleteString">Delete selected</p>
            </Button>
            <Alert severity='info' sx={{visibility: alert}}>{alertMessage}</Alert>
              
        </div>
            
    )
}