import { useState } from "react";
import './Login.css'
import { ToastContainer,toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
        // const navigate = useNavigate()
        const [userData, setUserData] = useState({"userName": "", "Password": ""});
        const navigate = useNavigate();
        let apiUrl = 'http://localhost:8080/login'
        async function liveData (e) {
            try {
                const name = e.target.name;
                const value = e.target.value;   
                setUserData((currentData) => {return {...currentData, [name]:value}})
            } catch (error) {
                console.log('Error while Updating the Onchange Data from the input Box',error);
            }
        }

        async function loginUser () {
            const options = {
               
                "headers": {
                    "Content-Type": "application/json"
                }
            }
            console.log('fetchuserdra',userData);
            axios.defaults.withCredentials = true;
            const response = await axios.get(`${apiUrl}/${userData['userName']}/${userData['Password']}`, options)
            console.log('rrrrrrr',response);
            if (response['data']['status'].toUpperCase() === 'SUCCESS') {
                toast.success('Login Successfull');
                setUserData({"userName": "", "Password": ""});
                setTimeout(()=> 
                {
                    navigate("/Todo")
                },1000)
            } else {
                console.log('Invalid Credentials');
                toast.error("Invalid Credentials")
                setUserData({"userName": "", "Password": ""});
            }
            // fetch(`${apiUrl}/${userData['userName']}/${userData['Password']}`, options).then(async(response)=> {
            //     // console.log('response.json()',response.json());
            //     {return response.json()}
            // }).then((res)=> {
            //     console.log('resss',res);
            //     if (res["status"].toUpperCase() === "SUCCESS") {
            //         toast.success('Login Successfull');
            //         setUserData({"userName": "", "Password": ""});
            //         setTimeout(()=> 
            //         {
            //             navigate("/Todo")
            //         },1000)
            //     } else {
            //         console.log('Invalid Credentials');
            //         toast.error("Invalid Credentials")
            //         setUserData({"userName": "", "Password": ""});
            //     }
            // }).catch((err)=> {
            //     console.log('Error while User Login in the Page',err);
            // })
        }

        return <div className="container">
            <div className="card">
                <div className="card-title mb-3 mt-5 text-center">
                   <h1> Login Form </h1>
                </div>
                <div className="card-body">
                    <ToastContainer position="top-center"/>
                    <input className="userbox" type="text" name="userName" placeholder="Enter Username" onChange={liveData} value={userData['userName']}></input>
                    <input className="pwdbox" type="password" name="Password" placeholder="Enter Password" onChange={liveData} value={userData['Password']}></input>
                    <button className="loginBtn" onClick={loginUser}>Login</button>
                    <div className="forgotpwd text-center">
                        <p> Forgot Your Password ?  
                            <a href="/forgot-password"> Reset Password</a>
                        </p>
                         <p>Create New Account 
                            <a href="/SignUp"> Sign Up</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
   
}

export default LoginPage