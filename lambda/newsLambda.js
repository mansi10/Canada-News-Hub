//Code referenced from: https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/sns-examples-publishing-messages.html
var AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});

var parameters = {
  Message: 'Hello from DalNewsHub!', 
  TopicArn: 'arn:aws:sns:us-east-1:009332342376:news-topic'
};

var snsPromise = new AWS.SNS();

var snsPublishPromise = snsPromise.publish(parameters).promise();

snsPublishPromise.then((info)=> {
    console.log(`Message ${parameters.Message} sent to the topic ${parameters.TopicArn} with message ID ${info.MessageId}`);
  }).catch(
    function(error) {
    console.error(error);
  });