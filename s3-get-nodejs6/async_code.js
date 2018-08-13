const aws = require('aws-sdk');
var mysql = require('mysql');
var rekognition = new aws.Rekognition();
let s3 = new aws.S3({ apiVersion: '2006-03-01' });
aws.config.apiVersions = {
  rekognition: '2016-06-27',
  // other service API versions
};

aws.config.update({region:'us-west-2'});

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

function selectQuery(dbconn, key){
    return new Promise(function(resolve,reject){
        dbconn.query('SELECT `object_key`,`labels` FROM photo WHERE object_key = ?',[key], function(err, results, fields){
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

function updateQuery(dbconn, key,labels){
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

exports.handler = async (event, context, callback) =>{
    
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
    
    try{
        //gets s3 object
        const data = await s3.getObject(params).promise();
        
        console.log(`Content Type:`, data.ContentType);
        console.log(`Event received. Bucket: ${bucket}, Key: ${key}.`);
        
        var param = {
                Image: {
                S3Object: {
                Bucket: bucket, 
                Name: key
                }
            },
            MaxLabels: 10,
            MinConfidence: 50
        };
        
        const results = await rekognition.detectLabels(param).promise();
        
        //compiles labels in a single array and converts into a string
        var label = results.Labels;
        var all_labels = [];
         
        for(var i=0;i<label.length; i++){
            all_labels.push(label[i].Name);
        }
        var csv_labels = all_labels.join();
        
        await insertQuery(conn);
        
        await selectQuery(conn,key);
        
        await updateQuery(conn,key, csv_labels);
        
        callback(null,"Finished");
        
    }
    catch(err){
        callback(err.message);
        
    }

};