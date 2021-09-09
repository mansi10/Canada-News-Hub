const express = require('express');
const AWS = require('aws-sdk');
const { uuid } = require('uuidv4');
const multerS3 = require('multer-s3');
const multer = require('multer')
const request = require('request');
const env = require('../data/env.json');

// AWS credentials 
var accessKeyId = ''
var secretAccessKey = ''
var sessionToken = ''

var s3 
var config
var dynamoDBClient



MIME_TYPE_ENUM = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
}

imageUrl = ""


AWS.config.update(env);
dynamoDBClient = new AWS.DynamoDB.DocumentClient();
s3 = new AWS.S3()

const store = multerS3({
    s3: s3,
    bucket: 'dalnewshub',
    acl: 'public-read',
    key: function (req, file, cb) {
        console.log("found image")
        console.log(file);
        MIME_TYPE_ENUM[file.mimetype]
        if (MIME_TYPE_ENUM[file.mimetype]) {
            imageUrl = "https://dalnewshub.s3.amazonaws.com/"+file.originalname + "-" + Date.now() + "." + MIME_TYPE_ENUM[file.mimetype];
            cb(null, file.originalname + "-" + Date.now() + "." + MIME_TYPE_ENUM[file.mimetype]);
        }
        else {
            cb(new Error(), "")
        }
    }
})
const router = express.Router();

//primary key for requests table needs to be decided
router.post('/', multer({ storage: store }).single("image"), (req, res) => {

    var status = "Pending";
    let createdOn = new Date().toISOString();
    const request = req.body;
    console.log(request);
    const requestId = uuid();
    const newsId = uuid();
    console.log(imageUrl)
    const requestItem = {
        RequestId: requestId,
        NewsId: newsId,
        RequesterName: request.createdBy,
        RequestType: request.requestType,
        CreatedOn: createdOn,
        Status: status,
        NewsTitle: request.title,
        NewsImageURL: imageUrl, // to be updated later
        NewsDescription: request.content
    }

    const requestParams = {
        TableName: "Requests",
        Item: requestItem
    };

    try {
        dynamoDBClient.put(requestParams).promise()
            .then(data => {
                console.log(data);
                res.status(201).json({
                    "status": true,
                    "message": 'News posting is created. It has been sent to Admin for approval',
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    "status": false,
                    "message": "News post with the same title already exists"
                })
            });
    } catch (error) {
        console.log("caught error")
        res.status(500).json({
            "message": "Something went wrong",
            "status": false
        })
    }

});

router.post('/delete', (req, res) => {

    var status = "Pending";
    let createdOn = new Date().toISOString();
    const request = req.body;
    console.log("delete post")
    console.log(request);
    const requestId = uuid();
    const requestItem = {
        RequestId: requestId,
        NewsId: request.NewsId,
        RequesterName: request.requestBy,
        RequestType: "Delete Post",
        CreatedOn: createdOn,
        Status: status,
        NewsTitle: request.NewsTitle,
        NewsImageURL: request.NewsImageURL,
        NewsDescription: request.NewsDescription
    }

    const requestParams = {
        TableName: "Requests",
        Item: requestItem
    };

    try {
        dynamoDBClient.put(requestParams).promise()
            .then(data => {
                console.log(data);
                res.status(201).json({
                    "status": true,
                    "message": 'News posting is created. It has been sent to Admin for approval',
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    "status": false,
                    "message": "News post with the same title already exists"
                })
            });
    } catch (error) {
        console.log("caught error")
        res.status(500).json({
            "message": "Something went wrong",
            "status": false
        })
    }

});

router.post('/update', (req, res) => {

    var status = "Pending";
    let createdOn = new Date().toISOString();
    const request = req.body;
    console.log("update post")
    console.log(request);
    const requestId = uuid();
    const requestItem = {
        RequestId: requestId,
        NewsId: request.NewsId,
        RequesterName: request.requestBy,
        RequestType: "Update Post",
        CreatedOn: createdOn,
        Status: status,
        NewsTitle: request.title,
        NewsImageURL: request.NewsImageURL,
        NewsDescription: request.content
    }

    const requestParams = {
        TableName: "Requests",
        Item: requestItem
    };

    try {
        dynamoDBClient.put(requestParams).promise()
            .then(data => {
                console.log(data);
                res.status(201).json({
                    "status": true,
                    "message": 'News posting is created. It has been sent to Admin for approval',
                });
            }).catch(err => {
                console.log(err);
                res.status(500).json({
                    "status": false,
                    "message": "News post with the same title already exists"
                })
            });
    } catch (error) {
        console.log("caught error")
        res.status(500).json({
            "message": "Something went wrong",
            "status": false
        })
    }

});

router.get('/', (req, res) => {

    const params = {
        TableName: "Requests"
    };

    try {
        dynamoDBClient.scan(params).promise().then((results) => {
            console.log("Fetched news posts are", results);

            res.status(200).json({
                "status" : true,
                "message" : "List of requests retrieved!",
                "results" : results.Items

            })
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                "status": false,
                "message": "Error in fetching results from Requests table"
            })
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({
            "status": false,
            "message": "Error in fetching news list"
        })
    }
})




module.exports = router;