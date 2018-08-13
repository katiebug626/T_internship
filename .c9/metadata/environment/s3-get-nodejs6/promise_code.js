{"filter":false,"title":"promise_code.js","tooltip":"/s3-get-nodejs6/promise_code.js","undoManager":{"mark":37,"position":37,"stack":[[{"start":{"row":0,"column":0},"end":{"row":134,"column":2},"action":"insert","lines":["const aws = require('aws-sdk');","var mysql = require('mysql');","var rekognition = new aws.Rekognition();","let s3 = new aws.S3({ apiVersion: '2006-03-01' });","aws.config.apiVersions = {","  rekognition: '2016-06-27',","  // other service API versions","};","","aws.config.update({region:'us-west-2'});","","function getRekLabels (event) {","    return  new Promise(function(resolve,reject){","        var param = {","                Image: {","                S3Object: {","                Bucket: event.Bucket, ","                Name: event.Key","                }","            },","            MaxLabels: 10,","            MinConfidence: 50","            };","            ","         var getLabelsPromise = rekognition.detectLabels(event).promise();","         getLabelsPromise","         .then(function(data){","             var label = data.Labels;","             var all_labels = [];","             //compiles all labels into a single array","             for(var i=0;i<label.length; i++){","                all_labels.push(label[i].Name);","             }","                var csv_labels = all_labels.join(); //joins all the labels","                resolve(csv_labels);","         }).catch(function(err){","             reject(err);","         });","    });","}","","","function insertQuery(dbconn){","    return new Promise(function(resolve,reject){","        var info = {","                        description: \"some image description\",","                        object_key: \"\",","                        labels: \"labels pending\"","                    };","        dbconn.query('INSERT INTO photo SET ?', info , function(err, reuslts, fields){","            if(err){","                dbconn.destroy();","                reject(err);","            }","            else{","                resolve();","            }","        });","    });","}","","function selectQuery(dbconn, key){","    return new Promise(function(resolve,reject){","        dbconn.query('SELECT `object_key`,`labels` FROM photo WHERE object_key = ?',[key], function(err, results, fields){","            if(err){","                dbconn.destroy();","                reject(err);","            }","            else{","                resolve();","            }","        });","    });","}","","function updateQuery(dbconn, key,labels){","    return new Promise(function(resolve,reject){","        console.log(`Updating key: ${key} with labels: ${labels}`);","        dbconn.query('UPDATE photo SET labels = ? WHERE object_key = ?', [labels,key], function(err, reuslts, fields){","            if(err){","                dbconn.destroy();","                reject(err);","            }","            else{","                resolve();","            }","        });","    });","}","","exports.handler = (event, context, callback) => {","    ","    //console.log('Received event:', JSON.stringify(event, null, 2));","","    // Get the object from the event and show its content type","    const bucket = event.Records[0].s3.bucket.name;","    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\\+/g, ' '));","    const params = {","        Bucket: bucket,","        Key: key,","    };","    ","    //connects to DB instance ","    var conn = mysql.createConnection({","        host: process.env.DATABASE_HOST,","        user: process.env.DATABASE_USER,","        password: process.env.DATABASE_PASSWORD,","        port: process.env.DATABASE_PORT, ","        database: process.env.DATABASE_DB_NAME,","    });","     ","    var getObjectPromise = s3.getObject(params).promise();","    getObjectPromise","    .then(function(data){","        ","        console.log(`Content Type:`, data.ContentType);","        console.log(`Event received. Bucket: ${bucket}, Key: ${key}.`);","        ","        return getRekLabels(params);","        ","    }).then(function(labels){","        return insertQuery(conn);","    }).then(function(labels){","        return selectQuery(conn,key,labels);","    }).then(function(labels){","        return updateQuery(conn,key,labels);","    }).then(function(){","       callback(null, `Finished`); ","    }).catch(function(err){","        callback(err.message);","    });","        ","      ","","};"],"id":1}],[{"start":{"row":16,"column":30},"end":{"row":16,"column":31},"action":"remove","lines":["B"],"id":2},{"start":{"row":16,"column":29},"end":{"row":16,"column":30},"action":"remove","lines":["."]},{"start":{"row":16,"column":28},"end":{"row":16,"column":29},"action":"remove","lines":["t"]},{"start":{"row":16,"column":27},"end":{"row":16,"column":28},"action":"remove","lines":["n"]},{"start":{"row":16,"column":26},"end":{"row":16,"column":27},"action":"remove","lines":["e"]},{"start":{"row":16,"column":25},"end":{"row":16,"column":26},"action":"remove","lines":["v"]},{"start":{"row":16,"column":24},"end":{"row":16,"column":25},"action":"remove","lines":["e"]}],[{"start":{"row":16,"column":24},"end":{"row":16,"column":25},"action":"insert","lines":["b"],"id":3}],[{"start":{"row":17,"column":28},"end":{"row":17,"column":29},"action":"remove","lines":["K"],"id":4},{"start":{"row":17,"column":27},"end":{"row":17,"column":28},"action":"remove","lines":["."]},{"start":{"row":17,"column":26},"end":{"row":17,"column":27},"action":"remove","lines":["t"]},{"start":{"row":17,"column":25},"end":{"row":17,"column":26},"action":"remove","lines":["n"]},{"start":{"row":17,"column":24},"end":{"row":17,"column":25},"action":"remove","lines":["e"]},{"start":{"row":17,"column":23},"end":{"row":17,"column":24},"action":"remove","lines":["v"]},{"start":{"row":17,"column":22},"end":{"row":17,"column":23},"action":"remove","lines":["e"]}],[{"start":{"row":17,"column":22},"end":{"row":17,"column":23},"action":"insert","lines":["e"],"id":5},{"start":{"row":17,"column":23},"end":{"row":17,"column":24},"action":"insert","lines":["v"]},{"start":{"row":17,"column":24},"end":{"row":17,"column":25},"action":"insert","lines":["e"]},{"start":{"row":17,"column":25},"end":{"row":17,"column":26},"action":"insert","lines":["n"]},{"start":{"row":17,"column":26},"end":{"row":17,"column":27},"action":"insert","lines":["t"]},{"start":{"row":17,"column":27},"end":{"row":17,"column":28},"action":"insert","lines":[","]}],[{"start":{"row":17,"column":27},"end":{"row":17,"column":28},"action":"remove","lines":[","],"id":6}],[{"start":{"row":17,"column":27},"end":{"row":17,"column":28},"action":"insert","lines":["."],"id":7},{"start":{"row":17,"column":28},"end":{"row":17,"column":29},"action":"insert","lines":["K"]}],[{"start":{"row":16,"column":24},"end":{"row":16,"column":25},"action":"insert","lines":["e"],"id":8},{"start":{"row":16,"column":25},"end":{"row":16,"column":26},"action":"insert","lines":["v"]},{"start":{"row":16,"column":26},"end":{"row":16,"column":27},"action":"insert","lines":["e"]},{"start":{"row":16,"column":27},"end":{"row":16,"column":28},"action":"insert","lines":["n"]},{"start":{"row":16,"column":28},"end":{"row":16,"column":29},"action":"insert","lines":["t"]},{"start":{"row":16,"column":29},"end":{"row":16,"column":30},"action":"insert","lines":["."]}],[{"start":{"row":16,"column":30},"end":{"row":16,"column":31},"action":"remove","lines":["b"],"id":9}],[{"start":{"row":16,"column":30},"end":{"row":16,"column":31},"action":"insert","lines":["B"],"id":10}],[{"start":{"row":24,"column":62},"end":{"row":24,"column":63},"action":"remove","lines":[")"],"id":11},{"start":{"row":24,"column":62},"end":{"row":24,"column":63},"action":"remove","lines":["."]},{"start":{"row":24,"column":62},"end":{"row":24,"column":63},"action":"remove","lines":["p"]},{"start":{"row":24,"column":62},"end":{"row":24,"column":63},"action":"remove","lines":["r"]}],[{"start":{"row":24,"column":61},"end":{"row":24,"column":62},"action":"remove","lines":["t"],"id":12},{"start":{"row":24,"column":60},"end":{"row":24,"column":61},"action":"remove","lines":["n"]},{"start":{"row":24,"column":59},"end":{"row":24,"column":60},"action":"remove","lines":["e"]},{"start":{"row":24,"column":58},"end":{"row":24,"column":59},"action":"remove","lines":["v"]},{"start":{"row":24,"column":57},"end":{"row":24,"column":58},"action":"remove","lines":["e"]}],[{"start":{"row":24,"column":57},"end":{"row":24,"column":58},"action":"insert","lines":["p"],"id":13},{"start":{"row":24,"column":58},"end":{"row":24,"column":59},"action":"insert","lines":["a"]},{"start":{"row":24,"column":59},"end":{"row":24,"column":60},"action":"insert","lines":["r"]},{"start":{"row":24,"column":60},"end":{"row":24,"column":61},"action":"insert","lines":["a"]},{"start":{"row":24,"column":61},"end":{"row":24,"column":62},"action":"insert","lines":["m"]},{"start":{"row":24,"column":62},"end":{"row":24,"column":63},"action":"insert","lines":["."]},{"start":{"row":24,"column":63},"end":{"row":24,"column":64},"action":"insert","lines":["p"]}],[{"start":{"row":24,"column":64},"end":{"row":24,"column":65},"action":"insert","lines":["r"],"id":14},{"start":{"row":24,"column":65},"end":{"row":24,"column":66},"action":"insert","lines":["o"]}],[{"start":{"row":24,"column":65},"end":{"row":24,"column":66},"action":"remove","lines":["o"],"id":15}],[{"start":{"row":24,"column":72},"end":{"row":24,"column":73},"action":"insert","lines":[")"],"id":16}],[{"start":{"row":24,"column":72},"end":{"row":24,"column":73},"action":"remove","lines":[")"],"id":17}],[{"start":{"row":24,"column":62},"end":{"row":24,"column":63},"action":"insert","lines":[")"],"id":18}],[{"start":{"row":75,"column":33},"end":{"row":75,"column":34},"action":"insert","lines":[" "],"id":19}],[{"start":{"row":61,"column":32},"end":{"row":61,"column":33},"action":"insert","lines":[","],"id":20},{"start":{"row":61,"column":33},"end":{"row":61,"column":34},"action":"insert","lines":[";"]},{"start":{"row":61,"column":34},"end":{"row":61,"column":35},"action":"insert","lines":["a"]},{"start":{"row":61,"column":35},"end":{"row":61,"column":36},"action":"insert","lines":["b"]},{"start":{"row":61,"column":36},"end":{"row":61,"column":37},"action":"insert","lines":["e"]},{"start":{"row":61,"column":37},"end":{"row":61,"column":38},"action":"insert","lines":["l"]},{"start":{"row":61,"column":38},"end":{"row":61,"column":39},"action":"insert","lines":["s"]}],[{"start":{"row":61,"column":38},"end":{"row":61,"column":39},"action":"remove","lines":["s"],"id":21},{"start":{"row":61,"column":37},"end":{"row":61,"column":38},"action":"remove","lines":["l"]},{"start":{"row":61,"column":36},"end":{"row":61,"column":37},"action":"remove","lines":["e"]},{"start":{"row":61,"column":35},"end":{"row":61,"column":36},"action":"remove","lines":["b"]},{"start":{"row":61,"column":34},"end":{"row":61,"column":35},"action":"remove","lines":["a"]},{"start":{"row":61,"column":33},"end":{"row":61,"column":34},"action":"remove","lines":[";"]}],[{"start":{"row":61,"column":33},"end":{"row":61,"column":34},"action":"insert","lines":["l"],"id":22},{"start":{"row":61,"column":34},"end":{"row":61,"column":35},"action":"insert","lines":["a"]},{"start":{"row":61,"column":35},"end":{"row":61,"column":36},"action":"insert","lines":["b"]},{"start":{"row":61,"column":36},"end":{"row":61,"column":37},"action":"insert","lines":["e"]},{"start":{"row":61,"column":37},"end":{"row":61,"column":38},"action":"insert","lines":["l"]},{"start":{"row":61,"column":38},"end":{"row":61,"column":39},"action":"insert","lines":["s"]}],[{"start":{"row":69,"column":24},"end":{"row":69,"column":25},"action":"insert","lines":["l"],"id":23},{"start":{"row":69,"column":25},"end":{"row":69,"column":26},"action":"insert","lines":["a"]},{"start":{"row":69,"column":26},"end":{"row":69,"column":27},"action":"insert","lines":["b"]},{"start":{"row":69,"column":27},"end":{"row":69,"column":28},"action":"insert","lines":["l"]},{"start":{"row":69,"column":28},"end":{"row":69,"column":29},"action":"insert","lines":["e"]},{"start":{"row":69,"column":29},"end":{"row":69,"column":30},"action":"insert","lines":["s"]}],[{"start":{"row":69,"column":29},"end":{"row":69,"column":30},"action":"remove","lines":["s"],"id":24},{"start":{"row":69,"column":28},"end":{"row":69,"column":29},"action":"remove","lines":["e"]},{"start":{"row":69,"column":27},"end":{"row":69,"column":28},"action":"remove","lines":["l"]}],[{"start":{"row":69,"column":27},"end":{"row":69,"column":28},"action":"insert","lines":["e"],"id":25},{"start":{"row":69,"column":28},"end":{"row":69,"column":29},"action":"insert","lines":["l"]},{"start":{"row":69,"column":29},"end":{"row":69,"column":30},"action":"insert","lines":["s"]}],[{"start":{"row":42,"column":27},"end":{"row":42,"column":28},"action":"insert","lines":[","],"id":26},{"start":{"row":42,"column":28},"end":{"row":42,"column":29},"action":"insert","lines":["l"]},{"start":{"row":42,"column":29},"end":{"row":42,"column":30},"action":"insert","lines":["a"]},{"start":{"row":42,"column":30},"end":{"row":42,"column":31},"action":"insert","lines":["e"]}],[{"start":{"row":42,"column":30},"end":{"row":42,"column":31},"action":"remove","lines":["e"],"id":27}],[{"start":{"row":42,"column":30},"end":{"row":42,"column":31},"action":"insert","lines":["b"],"id":28},{"start":{"row":42,"column":31},"end":{"row":42,"column":32},"action":"insert","lines":["e"]},{"start":{"row":42,"column":32},"end":{"row":42,"column":33},"action":"insert","lines":["l"]},{"start":{"row":42,"column":33},"end":{"row":42,"column":34},"action":"insert","lines":["s"]}],[{"start":{"row":55,"column":24},"end":{"row":55,"column":25},"action":"insert","lines":["l"],"id":29},{"start":{"row":55,"column":25},"end":{"row":55,"column":26},"action":"insert","lines":["a"]},{"start":{"row":55,"column":26},"end":{"row":55,"column":27},"action":"insert","lines":["b"]},{"start":{"row":55,"column":27},"end":{"row":55,"column":28},"action":"insert","lines":["l"]},{"start":{"row":55,"column":28},"end":{"row":55,"column":29},"action":"insert","lines":["e"]},{"start":{"row":55,"column":29},"end":{"row":55,"column":30},"action":"insert","lines":["s"]}],[{"start":{"row":55,"column":29},"end":{"row":55,"column":30},"action":"remove","lines":["s"],"id":30},{"start":{"row":55,"column":28},"end":{"row":55,"column":29},"action":"remove","lines":["e"]},{"start":{"row":55,"column":27},"end":{"row":55,"column":28},"action":"remove","lines":["l"]}],[{"start":{"row":55,"column":27},"end":{"row":55,"column":28},"action":"insert","lines":["e"],"id":31},{"start":{"row":55,"column":28},"end":{"row":55,"column":29},"action":"insert","lines":["l"]},{"start":{"row":55,"column":29},"end":{"row":55,"column":30},"action":"insert","lines":["s"]}],[{"start":{"row":121,"column":31},"end":{"row":121,"column":32},"action":"insert","lines":[","],"id":32},{"start":{"row":121,"column":32},"end":{"row":121,"column":33},"action":"insert","lines":["l"]},{"start":{"row":121,"column":33},"end":{"row":121,"column":34},"action":"insert","lines":["a"]},{"start":{"row":121,"column":34},"end":{"row":121,"column":35},"action":"insert","lines":["b"]},{"start":{"row":121,"column":35},"end":{"row":121,"column":36},"action":"insert","lines":["e"]},{"start":{"row":121,"column":36},"end":{"row":121,"column":37},"action":"insert","lines":["l"]},{"start":{"row":121,"column":37},"end":{"row":121,"column":38},"action":"insert","lines":["s"]}],[{"start":{"row":121,"column":37},"end":{"row":121,"column":38},"action":"remove","lines":["s"],"id":33}],[{"start":{"row":121,"column":37},"end":{"row":121,"column":38},"action":"insert","lines":["s"],"id":34}],[{"start":{"row":83,"column":17},"end":{"row":84,"column":0},"action":"insert","lines":["",""],"id":35},{"start":{"row":84,"column":0},"end":{"row":84,"column":16},"action":"insert","lines":["                "]},{"start":{"row":84,"column":16},"end":{"row":84,"column":17},"action":"insert","lines":["d"]},{"start":{"row":84,"column":17},"end":{"row":84,"column":18},"action":"insert","lines":["b"]},{"start":{"row":84,"column":18},"end":{"row":84,"column":19},"action":"insert","lines":["c"]},{"start":{"row":84,"column":19},"end":{"row":84,"column":20},"action":"insert","lines":["o"]},{"start":{"row":84,"column":20},"end":{"row":84,"column":21},"action":"insert","lines":["n"]},{"start":{"row":84,"column":21},"end":{"row":84,"column":22},"action":"insert","lines":["n"]}],[{"start":{"row":84,"column":22},"end":{"row":84,"column":23},"action":"insert","lines":["."],"id":36},{"start":{"row":84,"column":23},"end":{"row":84,"column":24},"action":"insert","lines":["e"]},{"start":{"row":84,"column":24},"end":{"row":84,"column":25},"action":"insert","lines":["n"]},{"start":{"row":84,"column":25},"end":{"row":84,"column":26},"action":"insert","lines":["d"]}],[{"start":{"row":84,"column":26},"end":{"row":84,"column":28},"action":"insert","lines":["()"],"id":37}],[{"start":{"row":84,"column":28},"end":{"row":84,"column":29},"action":"insert","lines":[";"],"id":38}]]},"ace":{"folds":[],"scrolltop":962,"scrollleft":0,"selection":{"start":{"row":84,"column":29},"end":{"row":84,"column":29},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":{"row":0,"state":"start","mode":"ace/mode/javascript"}},"timestamp":1534181996001,"hash":"2cc4562d52f73d2248760f53c1648a47b7edfaa1"}