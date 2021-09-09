const express = require('express');
const getNews = require('../data/getNews')
const getComments = require('../data/getComments')
const { uuid } = require('uuidv4');
const request = require('request');
const AWS = require('aws-sdk');
const env = require('../data/env.json');

var dynamoDBClient
var s3

AWS.config.update(env);
dynamoDBClient = new AWS.DynamoDB.DocumentClient();
s3 = new AWS.S3()

const router = express.Router();



router.get('/', (req, res, next) => {

  const params = {
    TableName: "News"
  };

  try {
    dynamoDBClient.scan(params).promise().then((results) => {
      console.log("Fetched news posts are", results);
      res.status(200).json({
        "status": true,
        "message": "List of news retrieved!",
        "results": results.Items
      })
    }).catch(err => {
      console.log(err);
      res.status(500).json({
        "status": false,
        "message": "Error in fetching results from News table"
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
});

router.post('/savePost', (req, res, next) => {

  const request = req.body;
  console.log(request);
  // const newsId = uuid();

  var Status = "Status";

  const newsItem = {
    NewsId: request.NewsId,
    CreatedBy: request.RequesterName,
    CreatedOn: request.CreatedOn,
    NewsTitle: request.NewsTitle,
    NewsImageURL: request.NewsImageURL,
    NewsDescription: request.NewsDescription
  }

  const newsParams = {
    TableName: "News",
    Item: newsItem
  };

  console.log(newsParams.Item);

  try {
    dynamoDBClient.put(newsParams).promise()
      .then(data => {
        console.log(data);
        //update Status in Requests table  
        var response = updateStatus(request.RequestId, request.NewsId, "Approved");

        res.status(201).json({
          "status": true,
          "message": 'News posting has been added',
        });
      }).catch(err => {
        console.log(err);
        res.status(500).json({
          "status": false,
          "message": "Something went wrong"
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

router.post('/updatePost', (req, res, next) => {

  const request = req.body;
  console.log(request);


  const params = {
    TableName: "News",
    Key: {
      NewsId: request.NewsId,
    },
    UpdateExpression: "set CreatedBy = :RequesterName,CreatedOn = :CreatedOn,NewsTitle = :NewsTitle, NewsDescription = :NewsDescription",
    ExpressionAttributeValues: {
      ':RequesterName': request.RequesterName,
      ':CreatedOn': request.CreatedOn,
      ':NewsTitle': request.NewsTitle,
      ':NewsDescription': request.NewsDescription
    },
    ReturnValues: 'UPDATED_NEW'
  }
  try {
    dynamoDBClient.update(params).promise()
      .then(data => {
        console.log(data);
        //update Status in Requests table  
        var response = updateStatus(request.RequestId,request.NewsId, "Approved");
        if (response) {
          res.status(200).json({
            "status": true,
            "message": 'News posting has been added',
          });
        }
        else {
          res.status(500).json({
            "status": false,
            "message": 'Something went wrong!',
          });
        }


      }).catch(err => {
        console.log(err);
        res.status(500).json({
          "status": false,
          "message": "Something went wrong"
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

router.post('/deletePost', (req, res, next) => {

  const request = req.body;
  console.log(request);
  try {
    var params = {
      TableName: "News",
      Key: {
        "NewsId": request.NewsId
      }
    };
    dynamoDBClient.delete(params, function (err, data) {
      if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
        res.status(500).json({
          "status": false,
          "message": 'something went wrong',
        });
      } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
        var response = updateStatus(request.RequestId,request.NewsId, "Approved")
        if (response) {
          // var params = {
          //   TableName: "Requests",
          //   Key: {
          //     "RequestId": request.RequestId,
          //     "NewsId": request.NewsId
          //   },
      
          //   ConditionExpression: "#key = :val",
          //   ExpressionAttributeNames:{
          //     "#key": "Status"
          //   },
          //   ExpressionAttributeValues: {
          //     ":val": "Pending"
          //   }
          // };
          // dynamoDBClient.delete(params, function (err, data) {
          //   if (err) {
          //     console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
          //     res.status(500).json({
          //       "status": false,
          //       "message": 'something went wrong',
          //     });
          //   } else {
          //     console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
                res.status(200).json({
                  "status": true,
                  "message": 'News posting has been deleted',
                });
          //   }
          // });
        }
        else {
          res.status(500).json({
            "status": false,
            "message": 'something went wrong',
          });

        }
      }
    });

  } catch (error) {
    console.log(error)
    res.status(500).json({
      "message": "Something went wrong",
      "status": false
    })
  }
});

async function updateStatus(RequestId, NewsId, status) {
  const params = {
    TableName: "Requests",
    Key: {
      RequestId: RequestId,
      NewsId: NewsId,
    },
    UpdateExpression: "set #key = :value",
    ExpressionAttributeNames: {
      "#key": "Status"
    },
    ExpressionAttributeValues: {
      ':value': status
    },
    ReturnValues: 'UPDATED_NEW'
  }
  return await dynamoDBClient.update(params).promise().then((response) => {
    console.log(response)
    return true;
  }, (error) => {
    console.log('Modifying data failed: ', error);
    return false
  })
}

router.get('/getComments/:id', (req, res, next) => {
  const newsId = req.params.id
  const params = {
    TableName: "Comments",
    FilterExpression: "#id = :news",
    ExpressionAttributeNames: {
      "#id": "NewsId"
    },
    ExpressionAttributeValues: {
      ":news": newsId
    }
  };

  try {
    dynamoDBClient.scan(params).promise().then((results) => {
      console.log("Fetched news posts are", results);
      res.status(200).json({
        "status": true,
        "message": "List of requests retrieved!",
        "results": results.Items
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
});

router.post('/saveComment', (req, res, next) => {

  console.log('Request received!');

  const request = req.body;
  console.log(request);
  const commentId = uuid();
  createdOn = new Date().toISOString();
  const commentItem = {
    CommentId: commentId,
    NewsId: request.newsId,
    CreatedBy: request.commentedBy,
    CreatedOn: createdOn,
    Comment: request.comment
  }

  const commentsParams = {
    TableName: "Comments",
    Item: commentItem,
  };

  console.log(commentsParams.Item);

  try {
    dynamoDBClient.put(commentsParams).promise()
      .then(data => {
        console.log(data);
        res.status(201).json({
          "status": true,
          "message": 'Comment has been posted',
        });
      }).catch(err => {
        console.log(err);
        res.status(500).json({
          "status": false,
          "message": "Something went wrong"
        })
      });
  } catch (error) {
    console.log("caught error")
    res.status(500).json({
      "message": "Something went wrong",
      "status": false
    })
  }


})

router.post('/decline', (req, res, next) => {

  const request = req.body;
  console.log(request);


  const params = {
    TableName: "News",
    Key: {
      NewsId: request.NewsId,
    },
    UpdateExpression: "set CreatedBy = :RequesterName,CreatedOn = :CreatedOn,NewsTitle = :NewsTitle, NewsDescription = :NewsDescription",
    ExpressionAttributeValues: {
      ':RequesterName': request.RequesterName,
      ':CreatedOn': request.CreatedOn,
      ':NewsTitle': request.NewsTitle,
      ':NewsDescription': request.NewsDescription
    },
    ReturnValues: 'UPDATED_NEW'
  }
  try {

        //update Status in Requests table  
        var response = updateStatus(request.RequestId,request.NewsId, "Rejected");
        if (response) {
          res.status(200).json({
            "status": true,
            "message": 'News posting has been added',
          });
        }
        else {
          res.status(500).json({
            "status": false,
            "message": 'Something went wrong!',
          });
        }


    


  } catch (error) {
    console.log("caught error")
    res.status(500).json({
      "message": "Something went wrong",
      "status": false
    })
  }
});


module.exports = router;