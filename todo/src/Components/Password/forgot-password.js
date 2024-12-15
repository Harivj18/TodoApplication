import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer,toast } from "react-toastify";
import './forgot-password.css'

const ForgotPassword = () => {
    const [userInfo, setInfo] = useState({
        "emailId": "",
        "phoneNo": ""
    });
    const navigate = useNavigate();
    const apiUrl = 'http://localhost:8080/forgot-password'

    function updateFieldValue (e) {
        const name = e.target.name;
        const value = e.target.value;

        setInfo((existingValue)=> ({...existingValue,[name]:value}))
    }

    async function forgotPwd () {
        let options = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json"
            }
        }
        if (userInfo['emailId'] !== "" && userInfo['phoneNo'] !== "") {
            options['body'] = JSON.stringify(userInfo);
            const changePassword = await axios.post(apiUrl, userInfo);
            console.log('changePassword',changePassword);
            if (changePassword.data.status.toUpperCase() === "SUCCESS") {
                console.log('Reset Mail Sent');
                toast.success('Mail Sent to User Email');
                setInfo({ "emailId": "","phoneNo": ""});
                setTimeout(()=> {
                    navigate('/login');
                },6000)
            } else if (changePassword['data']['status'].toUpperCase() === "NOT FOUND") {
                console.log('User Not Exist');
                toast.error('Invalid User');
                setInfo({ "emailId": "","phoneNo": ""})
            } else {
                console.log('Error while Reseting Password');
                toast.error('Oops!! Something Wrong Happened Please Try Again');
                setInfo({ "emailId": "","phoneNo": ""})
            }
        }

    }

    return <div className="container">
        <div className="card">
            <div className="card-title mb-3 mt-4 text-center">
                <h2>Forgot Password</h2>
            </div>
            <div className="card-body">
                <ToastContainer position="top-center" />
                    <input type="email" className="fields" name="emailId" value={userInfo.emailId} onChange={updateFieldValue} placeholder="Enter Email Id"></input>
                    <input type="number" className="fields" name="phoneNo" value={userInfo.phoneNo} onChange={updateFieldValue} placeholder="Enter Mobile No"></input>
                    <button type="submit" className="forgot" onClick={forgotPwd}>Submit</button>
            </div>
        </div>
    </div>
}

export default ForgotPassword;