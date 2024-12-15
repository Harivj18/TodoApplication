import { useEffect, useState } from "react";
import { Button, EditableText, InputGroup, Toaster } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";  // Required for Blueprint.js
import './todo.css'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";


const Todo = () => {
    const apiUrl = 'http://localhost:8080/todo'
    const [todo, setTodo] = useState("");
    const [msg,setMsg] = useState("");
    const [buttonName, setBtnName] = useState("Add");
    const [updateDoc, setUpdateDoc] = useState({});

    useEffect(()=>{
        fetchTodoValue()

    },[]);

    const fetchTodoValue = async () => {
        const options = {
            "headers": {
                "Content-Type": "application/json"
            }
        }
        // axios.defaults.withCredentials = true;
        await axios.get(`${apiUrl}/getData`, {}, {withCredentials: true}).then((response) => {
            console.log('responseresponse',response);
            if (response !== undefined && response['data']['status'].toUpperCase() === 'SUCCESS' 
                && response['data']['records'].length > 0) {
                console.log('Data Fetching Successfully');
                // toast.success("Data Fetching Successfully");
                console.log('response[data][records]',response['data']['records']);
                setMsg(response['data'])
                console.log('msgsss',msg);
            }
        }).catch((err) => {
            console.log('Error while fetchig data from db',err);
            toast.error('Error while fetchig data from db')
        })
        // fetch(`${apiUrl}/getData`,options).then((fetchedData)=>{
        //     {return fetchedData.json()}
        // }).then((response)=> {
        //     if (response['status'].toUpperCase() === "SUCCESS" && response['records'].length > 0) {
        //         console.log('Data Fetching Successfully');
        //         // toast.success("Data Fetching Successfully");
        //         setMsg(response)
        //         console.log('msgsss',msg);
        //     }
        // }).catch((err)=> {
        //     console.log('Error while fetchig data from db',err);
        //     toast.error('Error while fetchig data from db')
        // })
    }
    
    const updateTodoValue = (e) => {
        setTodo(e.target.value)
        console.log('todo',todo);
    }

    const submitData = async (e) => {
        e.preventDefault()
        const data = todo.trim();
        let reqType = '';
        let apiRequest = ''
        let message = {};
        let toastMsg;
        if (buttonName.toUpperCase() === 'ADD') {
            reqType = 'POST';
            apiRequest = 'addData'
            message = {
                "message": data
            }
            toastMsg = 'Add'
        } else {
            reqType = 'PUT';
            apiRequest = `updateData`
            updateDoc['message'] = data
            message = updateDoc;
            toastMsg = 'updat'
        }

        const options = {
            "method": reqType,
            "headers": {
                "Content-Type": "application/json"
            },
            "body": JSON.stringify(message)
        }

        if(data !== "" && data !== undefined && data !== null) {
            console.log('messagemessage',options);
            fetch(`${apiUrl}/${apiRequest}`,options)
            .then((resp)=> {
                {return resp.json()}
            }).then((res)=> {
                console.log(`Todo Was ${toastMsg}ed Successfully`,res);
                if (res !== undefined && res['status'].toUpperCase() === 'SUCCESS') {
                    toast.success(`ToDo ${toastMsg}ed Successfully`);
                    fetchTodoValue()
                    setTodo("")
                    setBtnName("Add")
                }
            })
            .catch((err)=> {
                setTodo("")
                setBtnName("Add")
                toast.error(`Error While ${toastMsg}ing Todo`)
                console.log(`Error While ${toastMsg}ing Todo`,err);
            })
        } else {
            toast.error('It seems You Entered Invalid Data');
            setTodo("")
            setBtnName("Add")
            console.log('Invalid Data Found',data);
        }
    }

    const updateData = (e) => {
        console.log('Event triggered data',e);
        const updateTodoVal = msg['records'].filter((val,i)=> Number(i) === Number(e.target.value));
        if (updateTodoVal.length > 0) {
            const newData = updateTodoVal[0]['message'];
            setUpdateDoc(updateTodoVal[0])
            setTodo(newData)
            setBtnName("Update")
        }
        
    }

    const deleteData = (e) => {
        console.log('eventeee',e.target.value);
        console.log('fff',msg);
        const delTodoVal = msg['records'].filter((val,i) => Number(i) === Number(e.target.value));
        const options = {
            "method": 'DELETE',
            "headers": {
                "Content-Type": "application/json"
            }
        }
        fetch(`${apiUrl}/deleteData/${delTodoVal[0]['_id']}`, options).then((resp)=> {
            {return resp.json()}
        })
        .then((res)=> {
            console.log('rrrrrr',res);
            if (res['status'].toUpperCase() === 'SUCCESS') {
                toast.error('Data Deleted Successfully');
                fetchTodoValue()
            } else {
                toast.error('Error while Deleting data')
            }
        }).catch((err)=> {
            toast.error('Error Occured while Deleting data from the mongodb')
        })
    }

    return <div className="content">
        <div className="card" style={{"width": "40rem"}}>
            <div className="card-body">
                <h2 className="card-title mb-4 mt-2 text-center" >Todo App</h2>
                <input type="text"  onChange={updateTodoValue} className="inputbox" placeholder="Enter Your Todo" name="todo" value={todo}></input>
                <button className="add" onClick={submitData}>{buttonName}</button>
                <ToastContainer position="top-center"/>
                {msg !== "" && msg['records'].length > 0 && msg['records'].map((data, i) => (
                    <div className="todoData" key={i} >
                        <p>
                            {data['message']}
                        </p>
                        <div className="grpBtn">
                            <button onClick={updateData} className="updateBtn" value={i}>Edit</button>
                            <button onClick={deleteData} className="deleteBtn" value={i}>Delete</button>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    </div>

}

export default Todo;