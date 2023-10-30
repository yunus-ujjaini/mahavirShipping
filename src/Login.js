import './login.css';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs } from "firebase/firestore"; 
import { Outlet, Link, useNavigate, redirect } from "react-router-dom";
import {ReactSession} from 'react-client-session';

function Login(props) {
    const navigate = useNavigate();
    

    const firebaseConfig = {
        apiKey: "AIzaSyBXMUYnWGcGoljKmQYZJE2gML1_N1lEdx8",
        authDomain: "mahavirshipping-1b63e.firebaseapp.com",
        databaseURL: "https://mahavirshipping-1b63e-default-rtdb.firebaseio.com",
        projectId: "mahavirshipping-1b63e",
        storageBucket: "mahavirshipping-1b63e.appspot.com",
        messagingSenderId: "1048875294290",
        appId: "1:1048875294290:web:24e15eba5efbbde84c498b",
        measurementId: "G-K31BC8JJNQ"
    };


    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    async function performLogin(){
        let userName=document.getElementById("userName").value;
        let userPass=document.getElementById("passWord").value;
        const querySnapshot = await getDocs(collection(db, "Users"));
        let correctCreds=false;
        querySnapshot.forEach((doc) => {
            if(doc.data().UserName === userName && doc.data().Password === userPass){
                correctCreds=true;
                ReactSession.setStoreType("sessionStorage");
                ReactSession.set("userId",doc.data().Usertype);
                console.log("All good");
                navigate("/Gatepass");
            }
        });
        if(!correctCreds){
            console.log("Incorrect ");
        }
    }
    return (
        <div className="container">
        <h1>Mahavir Shipping</h1>
        <div className="login-main">
            <input placeholder="Username" type="text" id='userName'/>
            <input placeholder="Password" type="password" id='passWord'/>
            <button onClick={performLogin}>Login</button>
        </div>
        </div>
    );
}

export default Login;
