const express = require('express');
const AWS = require('aws-sdk');
const { uuid } = require('uuidv4');
var crypto = require('crypto');
const request = require('request');
const env = require('../data/env.json');

var dynamoDBClient
AWS.config.update(env);
dynamoDBClient = new AWS.DynamoDB.DocumentClient();
s3 = new AWS.S3()

const router = express.Router();

router.post('/register', (req, res) => {

    const request= req.body; 
    console.log(request);
    const userId = uuid();

    var hashedPassword = crypto.createHash('md5').update(request.Password).digest('hex');

    const item={
        UserID: userId,
        FirstName :  request.FirstName,
        LastName : request.LastName,
        Email : request.Email,
        Password : hashedPassword ,
        Role : request.Role
    }

    const params = {
        TableName: "User",
        Item : item,
        ConditionExpression: 'attribute_not_exists(Email)'
    };

    if(request.Role == "Auditor"){
        params.Item.ReasonForBeingAuditor = request.ReasonForBeingAuditor;
    }

    try{
        // const listofUsers =  getUsers();

        dynamoDBClient.put(params).promise()
        .then(data => {
            console.log(data);
            res.status(201).json({
                "status" : true,
                "message" : 'Registration is successful',
            });
            }).catch(err => {
                    console.log(err);
                    res.status(500).json({
                            "status" : false,
                            "message" : "This email is already registered with us"
                        })
                    });
        } catch (error) {
                console.log("caught error")
                res.status(500).json({
                "message": "Something went wrong",
                "status": false
                })
            }
    // next();
});

router.post('/signin', (req, res, next) => {
    //check if the user exists.
    const request = req.body;
    const email = request.Email;
    // const password = request.Password;
    console.log(request)

    var hashedPassword = crypto.createHash('md5').update(request.Password).digest('hex');
    console.log(hashedPassword)

    const params = {
        TableName :"User",
        Key: {
            Email: email
          }
    }

    try{
     dynamoDBClient.get(params).promise().then((response) => {
        console.log(params)
        console.log(response.Item)
        if(response.Item.Password == hashedPassword){
            res.status(201).json({
                "status" : true,
                "message" : 'User is authenticated',
                "data" : {
                    UserID: response.Item.UserID,
                    Role: response.Item.Role,
                    FirstName: response.Item.FirstName,
                    LastName: response.Item.LastName,
                    Email: response.Item.Email,
                    loginStatus: true
                  }
            });
        }
        // else {
        //     res.status(404).json({
        //         "status" : false,
        //         "message" : 'User is not authenticated',
        //     });
        // }
     }).catch(err => {
        console.log(err);
        res.status(404).json({
            "status" : false,
            "message" : 'User is not authenticated',
        });
        });
    }catch(error) {
        console.log(error)
        res.status(500).json({
        "message": "Something went wrong",
        "status": false
        })
    }

    //generate and return the auth token back

    // next();
});

router.post('/resetPassword', (req, res, next) => {
    res.status(200).json("Express is working");
    next();
});




module.exports = router;