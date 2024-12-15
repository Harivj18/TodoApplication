const express = require('express');
const router = express.Router()
const connection = require('./Connections/connection');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const secretKey = 'Hari';
const bcrypt = require('bcrypt');
const salt = 10;
const nodemailer = require('nodemailer');


let collection;
const accessKey = 'TodoAccessKey';
const refreshKey = 'TodoRefreshKey';

connection().then((data)=> {
    collection = data
})

const mailTransport = nodemailer.createTransport({
    "service": "gmail",
    "secure": true,
    "port": 587,
    "auth": {
        "user": "djangot1798@gmail.com",
        "pass": "pfoepyyuxemqhfku"
    }
});

// middleware for auth Routes

const verifyRoutes = async (req, res, next) => {
    try {
        console.log('req.cookie.',req.cookies);
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            jwt.verify(refreshToken, refreshKey, (err,decoded)=> {
                if (err) {
                    return res.json({"status": "ERROR", "message": 'Invalid User Session'})
                } else {
                    jwt.verify(refreshToken, refreshKey, (err, refreshdecode) => {
                        if (err) {
                            return res.json({"status": "ERROR","message":"Invalid Access Token"})
                        } else {
                            req.userName = accessDecode.userName;
                            const accessToken = req.cookie.accessToken;
                            if (accessToken) {
                                jwt.verify(accessToken, accessKey, (err, accessDecode) => {
                                    if (err) {
                                        return res.json({"status": "ERROR","message":"Invalid Access Token"})
                                    } else {
                                        req.userName = accessDecode.userName;
                                        console.log('Hello verified');
                                        next();
                                    }
                                })
                            } else {
                                // return res.json({"status": "ERROR","message":"Session Expired"})
                                if(renewAccessToken(req,res)) {
                                    next()
                                }
                            }
                        }
                    })
                }
            })
        } else {
           return res.json({"status": "ERROR","message":"Session Expired"})
        }
    } catch(error) {
        console.log('Error while Auth Routes',error);
        throw error; 
    }
}

const renewAccessToken = (req,res) => {
    try {
        const accessToken = jwt.sign({userName: req.userName},accessKey, {'expiresIn': '1m'});
        req.cookie('accessToken', accessToken, {maxAge: 10000, httpOnly:true});
        return true;
    } catch (error) {
        console.log('Error while Renew Access Token',error);
        throw error; 
    }
}

    router.post('/todo/addData', async(req,res)=> {
        try {
            const data = {
                "message": req.body?.message,
                "type": "TodoMessage"
            }
            console.log('addData',data);
            await collection.insertOne(data).then((response)=> {
                console.log('Data Added into the Db successfully');
                res.send({status: "SUCCESS"})
                res.end()
            }).catch((err)=> {
                console.log('Error Adding data into the Db',err);
                res.send({status: 'ERROR'})
                res.end()
            })
        } catch (error) {
            console.log('Error occurs while inserting Data into the DB',error)
            res.send({status: 'ERROR'})
            res.end()
        }
    })

    

    router.get('/todo/getData',async (req,res)=> {
        try {
            const data = {"type": "TodoMessage"};
            // console.log('reqreq',req.cookies);
            await collection.find(data).toArray().then((fetchedData)=> {
                console.log('Data Fetched Successfully from the Db',fetchedData);
                res.send({status: "SUCCESS", records : fetchedData})
                res.end()
            }).catch((err)=> {
                console.log('Error while getting data from db',err);
                throw err;
            })
        } catch (error) {
            console.log('Error occurs while fetching todo Data',error);
            res.send({status: 'ERROR'})
            res.end()
        }
    })

    router.put('/todo/updateData', async(req,res)=> {
        try {
            const updateQuery = {"_id": new ObjectId(req.body._id)};
            const updateValue = {
                $set: {
                    "message": req.body.message
                }
            }
            console.log('updateValue',updateValue);
            console.log('updateQuery',updateQuery);
            const options = {"upsert": true};
            await collection.updateOne(updateQuery,updateValue,options).then((response)=> {
                console.log('responssss',response);
                if(response.hasOwnProperty('modifiedCount')) {
                    res.send({status: "SUCCESS"})
                    res.end()
                }
            }).catch((error)=> {
                console.log('Error when updating data into mongodb',error);
            })
        } catch (error) {
            console.log('Error while updating into the mongodb');
            throw error;
        }
    })

    router.delete('/todo/deleteData/:id', async(req,res)=> {
        try {
            console.log('req.paramsreq.params',req.params);
            const deleteQuery = {'_id': new ObjectId(req.params.id)}
            console.log('deleteQuery',deleteQuery);
            await collection.deleteOne(deleteQuery).then((response)=> {
                console.log('Data Deleted Successfully from the mongodb',response);
                if (response.deletedCount !== 0) {
                    res.send({status: "SUCCESS"})
                    res.end()
                } else {
                    res.send({status: "ERROR"})
                    res.end()
                }
            }).catch((err)=> {
                console.log('Error when deleting data from the mongodb',err);
            })
        } catch (error) {
            console.log('Error occurs while deleting the data');
            throw error;
        }
    })

    router.post('/Signup', async(req,res) => {
        try {
            let token;
            let hashedPwd;
            console.log(req.body);
            if (req.body.userName !== "" && req.body.userName !== undefined) {
                token = jwt.sign(req.body.userName, secretKey)
            }
            if (req.body.password !== "" && req.body.password !== undefined) {
                hashedPwd = await bcrypt.hash(req.body.password, salt)
            }

            const newUser = {
                "userName": req.body.userName,
                "firstName": req.body.firstName,
                "lastName": req.body.lastName,
                "emailId": req.body.emailId,
                "phoneNo": req.body.phoneNo,
                "password": hashedPwd,
                "token": token,
                "type": "LoginInfo"
            }


            if (newUser !== undefined) {
                await collection.insertOne(newUser).then((data)=> {
                    if (data['acknowledged'] && data['insertedId'] !== "") {
                        res.send({"status": "SUCCESS", "message": data['insertedId']})
                        res.end()
                    } else {
                        res.send({"status": "ERROR", "message": ""})
                        res.end();
                    }
                }).catch((err)=> {
                    console.log('Error while Creating User For the Todo App',err);
                })
            }

            console.log('newUser',newUser);
        } catch (error) {
            console.log('Error while creating user',error);
            throw error;
        }
    })

    router.get('/login/:id/:password', async(req,res)=> {
        try {
            const fetchUserInfo = {
                "userName": req.params.id,
                "type": "LoginInfo"
            }
            console.log('req.pa',req.params);
            const password = req.params.password
            console.log('fetchUserInfo',fetchUserInfo);
            await collection.findOne(fetchUserInfo).then(async(response)=> {
                console.log('responseresponse',response);
                if (response !== undefined) {
                    // const key = jwt.sign(response['password'],'Harijwt')
                    // const hashedData = jwt.verify(key,'Harijwt');
                    const hashedData = await bcrypt.compare(password,response['password'])
                    console.log('hashedData',hashedData);
                    console.log('response[password]',password);
                    if(hashedData) {
                        const accessToken = jwt.sign({userName: req.params.id}, accessKey, {'expiresIn': '1m'});
                        const refreshToken = jwt.sign({userName: req.params.id}, refreshKey, {'expiresIn': '2m'});
                        res.cookie('accessToken', accessToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true,  sameSite: 'Strict', secure: false})
                        res.cookie('refreshToken', refreshToken, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true,  sameSite: 'Strict', secure:false})
                        // localStorage.setItem('accessToken', accessToken)
                        res.send({"status": "SUCCESS", "data": response});
                        res.end()
                    } else {
                        res.send({"status": "FAILED", "data": [], "message": "Invalid Credentials"})
                        res.end()
                    }
                } else {
                    console.log('Login Fetched Data was something wrong');
                    res.send({status: "ERROR"})
                    res.end()
                }
            }).catch((err)=> {
                console.log('Error while fetching Login Info from the Mongodb',err);
                res.send({
                    "status": "ERROR"
                })
                res.end()
            })
        } catch (error) {
            console.log('Error while Login by user',error);
            throw error;
        }
    })

    router.post('/forgot-password', async(req,res) => {
        try {
            const userData = {
                "emailId": req.body.emailId,
                'phoneNo': req.body.phoneNo,
                "type": "LoginInfo"
            }
            await collection.findOne(userData).then((response)=> {
                console.log('forgotresponse',response);
                if(response !== null && Object.keys(response).length > 0) {
                    const recipientInfo = {
                        "from": "djangot1798@gmail.com",
                        "to": response.emailId,
                        "subject": "Reset Password",
                        "text": `Kindly Use the Link to Reset Password http://localhost:3000/reset-password/${response.userName}/${response.token}`
                    }
                    mailTransport.sendMail(recipientInfo, (Info,message)=> {
                        console.log('InfoInfo',Info);
                        if(Info === null && message.hasOwnProperty('messageId')) {
                            console.log(`Mail Sent Successfully to ${response.userName}`);
                            res.json({
                                "status": "SUCCESS",
                                "message": `Mail Sent to ${response.userName}`
                            })
                            res.end()
                        }
                    })
                } else {
                    console.log('User Not Exist in DB to reset password');
                    res.json({
                        "status": "Not Found",
                        "message": "User Not Exist"
                    })
                    res.end()
                }
            }).catch((err)=> {
                console.log('Error while Fetching userInfo exist in db',err);
                res.json({
                    "status": "ERROR",
                    "message": "Error while Fetching userInfo"
                })
                res.end()
            })
        } catch (error) {
            console.log('Error while Making Forgot Password', error);
            throw error;
        }
    })

module.exports = router