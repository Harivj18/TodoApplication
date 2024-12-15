import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./SignUp.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [userData, setUserData] = useState({
        userName: "", 
        firstName: "",
        lastName: "",
        emailId: "",
        phoneNo: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const apiUrl = `http://localhost:8080/Signup`;

    const validate = () => {
        const newErrors = {};
        if (!userData.userName) newErrors.userName = "UserName is required";
        if (!userData.emailId) newErrors.emailId = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(userData.emailId)) newErrors.emailId = "Email address is invalid";
        if (!userData.phoneNo) newErrors.phoneNo = "Phone number is required";
        else if (!/^\d{10}$/.test(userData.phoneNo)) newErrors.phoneNo = "Phone number must be 10 digits";
        if (!userData.password) newErrors.password = "Password is required";
        else if (userData.password.length < 6) newErrors.password = "Password must be at least 6 characters long";
        return newErrors;
    };

    const createUser = async (e) => {
        e.preventDefault();
        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
        } else {
            try {
                const response = await axios.post(apiUrl, userData);
                console.log('response of axios success', response);

                if (response.data.status.toUpperCase() === "SUCCESS") {
                    setUserData({
                        userName: "", 
                        firstName: "",
                        lastName: "",
                        emailId: "",
                        phoneNo: "",
                        password: ""
                    });
                    toast.success('Your Account was created Successfully 😊');
                    setTimeout(()=> {
                        navigate('/Login');
                    },1200)
                } else {
                    toast.error('Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('Error while creating user', error);
                toast.error('Error while creating user');
            }
        }
    };

    const updateUser = (e) => {
        const name = e.target.name;
        const value = e.target.value;

        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value
        }));

        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <div className="container">
            <div className="card">
                <div className="card-title mb-3 mt-5 text-center">
                    <h2>Create User</h2>
                </div>
                <div className="card-body">
                    <ToastContainer position="top-center" />
                    <form onSubmit={createUser} noValidate>
                        <input
                            type="text"
                            placeholder="UserName"
                            name="userName"
                            value={userData.userName}
                            className="inputBox"
                            onChange={updateUser}
                        />
                        {errors.userName && <div className="error">{errors.userName}</div>}
                        
                        <input
                            type="text"
                            placeholder="FirstName"
                            name="firstName"
                            value={userData.firstName}
                            className="inputBox"
                            onChange={updateUser}
                        />
                        
                        <input
                            type="text"
                            placeholder="LastName"
                            name="lastName"
                            value={userData.lastName}
                            className="inputBox"
                            onChange={updateUser}
                        />
                        
                        <input
                            type="email"
                            placeholder="EmailId"
                            name="emailId"
                            value={userData.emailId}
                            className="inputBox"
                            onChange={updateUser}
                        />
                        {errors.emailId && <div className="error">{errors.emailId}</div>}
                        
                        <input
                            type="number"
                            placeholder="Mobile No"
                            name="phoneNo"
                            value={userData.phoneNo}
                            className="inputBox"
                            onChange={updateUser}
                        />
                        {errors.phoneNo && <div className="error">{errors.phoneNo}</div>}
                        
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={userData.password}
                            className="inputBox"
                            onChange={updateUser}
                        />
                        {errors.password && <div className="error">{errors.password}</div>}
                        
                        <button className="SignBtn" type="submit">Sign In</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignUp;
