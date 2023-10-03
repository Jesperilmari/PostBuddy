
import* as React from 'react';
import LogIn from './Login';
import SignUp from './Signup';

function LoginPage() {
    return (
        <>    
            <LogIn></LogIn>
        </>
       
    );
}

function SignUpPage() {
    return (
        <>    
           <SignUp></SignUp>
        </>
       
    );
}

export {LoginPage, SignUpPage};