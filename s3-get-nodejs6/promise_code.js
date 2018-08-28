const aws = require('aws-sdk');
var mysql = require('mysql');
var rekognition = new aws.Rekognition();
let s3 = new aws.S3({ apiVersion: '2006-03-01' });
aws.config.apiVersions = {
  rekognition: '2016-06-27',
  // other service API versions
};

aws.config.update({region:'us-west-2'});

function getRekLabels (event) {
    return  new Promise(function(resolve,reject){
        var param = {
                Image: {
                S3Object: {
                Bucket: event.Bucket, 
                Name: event.Key
                }
            },
            MaxLabels: 10,
            MinConfidence: 50
            };
            
         var getLabelsPromise = rekognition.detectLabels(param).promise();
         getLabelsPromise
         .then(function(data){
             var label = data.Labels;
             var all_labels = [];
             //compiles all labels into a single array
             for(var i=0;i<label.length; i++){
                all_labels.push(label[i].Name);
             }
                var csv_labels = all_labels.join(); //joins all the labels
                resolve(csv_labels);
         }).catch(function(err){
             reject(err);
         });
    });
}


function insertQuery(dbconn){
    return new Promise(function(resolve,reject){
        var info = {
                        description: "some image description",
                        object_key: "",
                        labels: "labels pending"
                    };
        dbconn.query('INSERT INTO photo SET ?', info , function(err, reuslts, fields){
            if(err){
                dbconn.destroy();
                reject(err);
            }
            else{
                resolve();
            }
        });
    });
}



function updateQuery(dbconn, key, labels){
    return new Promise(function(resolve,reject){
        console.log(`Updating key: ${key} with labels: ${labels}`);
        dbconn.query('UPDATE photo SET labels = ? WHERE object_key = ?', [labels,key], function(err, reuslts, fields){
            if(err){
                dbconn.destroy();
                reject(err);
            }
            else{
                dbconn.end();
                resolve();
            }
        });
    });
}

exports.handler = (event, context, callback) => {
    
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    
    //connects to DB instance 
    var conn = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        port: process.env.DATABASE_PORT, 
        database: process.env.DATABASE_DB_NAME,
    });
    var getObjectPromise = s3.getObject(params).promise();
    getObjectPromise
    .then(function(data){
        
        console.log(`Content Type:`, data.ContentType);
        console.log(`Event received. Bucket: ${bucket}, Key: ${key}.`);
        
        return insertQuery(conn);
    }).then(function(){
        return getRekLabels(params);
    }).then(function(labels){
        return updateQuery(conn,key,labels);
    }).then(function(){
       callback(null, `Finished`); 
    }).catch(function(err){
        callback(err.message);
    });
        
};