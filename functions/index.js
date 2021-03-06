const functions = require('firebase-functions');

const  SENDGRID_API_KEY = functions.config().sendgrid.key;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);


const admin = require('firebase-admin');


var serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://newsapp1-a9aa9.firebaseio.com"
});

// admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

exports.addUserDBSendWelcomeEmail = functions.auth.user().onCreate(event => {
  const user = event.data; // The Firebase user.
  const userRef = db.collection('/users');
  const success = db.collection('/success');
  const error = db.collection('/error');
  const uid = user.uid;
  const email = user.email;
  
  if(user.displayName){
    const userName = user.displayName;
  }

  if(email){
    const userName = email.substring(0, email.indexOf("@"));
  }
  

  var userObj = {
    uid: uid,
    displayName : user.displayName || null,
    email : user.email || null,
    photoURL: user.photoURL || null,
    phoneNumber: user.phoneNumber || null ,
    emailVerified: user.emailVerified ,
    firstName: null,
    secondName: null,
    userName: userName || null
  };

  //add user to db
  console.log(userObj);
  return userRef.doc(uid).set(userObj)
        .then(result =>{
          if(user.email !== null){
            const msg ={
              to: user.email,
              from: "iansam@otherside.co.ke",
  
              templateId:"3834bfb9-cd7f-46dd-b6b4-5b06bc5727c6"
            };
  
            return sgMail.send(msg)
            .then((response)=>{
              success.add({
                type: "UserAddEmailSent",
                reponse: response,
                uid: uid
              });
            })
            .catch(err=>{
              success.add({
                type: "UserAddEmailSending",
                error: err,
                uid: uid
              })
            });  
          }
          
        })
        .catch(err=>{
          console.log(err);
        });
});

// exports.readUsersAdded = functions.firestore
// .document('users/{userId}')
// .onCreate(event => {
//     var userDets = event.data.data();

//     const msg = {
//       to : userDets.email,
//       from : "iansam@otherside.co.ke",
//       subject : "Welcome to Knews",
//       text : "Welcome to News From Kenya. To complete profile Got to Apps Settings."
//     };
//     sgMail.send(msg)
//     .then(data=>{
//       console.log("Success: " + data);
//       // logRef.add({
//       //   logData : data,
//       //   type: "Success"
//       // });
//     })
//     .catch(err=>{
//       console.log("Error " + err);
//       // logRef.add({
//       //   logData : data,
//       //   type: "Success"
//       // });
//     });
//     // function sendgridEmail (req, res, userDets) {
//     //   return Promise.resolve()
//     //     .then(() => {
//     //       if (req.method !== 'POST') {
//     //         const error = new Error('Only POST requests are accepted');
//     //         error.code = 405;

//     //         throw error;
//     //       }
          
//           // req.to = userDets.email;
//           // req.from = "iansam@otherside.co.ke";
//           // req.subject = "Welcome to Knews"
//           // req.content = "Welcome to News From Kenya. To complete profile Got to Apps Settings."
//     //       req.
//     //       // Get a SendGrid client
//     //       const client = getClient(req.query.sg_key);
//     //       req.body.to = userDets.email
//     //       // Build the SendGrid request to send email
//     //       const request = client.emptyRequest({
//     //         method: 'POST',
//     //         path: '/v3/mail/send',
//     //         body: getPayload(req.body)
//     //       });
    
//     //       // Make the request to SendGrid's API
//     //       console.log(`Sending email to: ${req.body.to}`);
//     //       return client.API(request);
//     //     })
//     //     .then((response) => {
//     //       if (response.statusCode < 200 || response.statusCode >= 400) {
//     //         const error = Error(response.body);
//     //         error.code = response.statusCode;
//     //         throw error;
//     //       }
    
//     //       console.log(`Email sent to: ${req.body.to}`);
    
//     //       // Forward the response back to the requester
//     //       res.status(response.statusCode);
//     //       if (response.headers['content-type']) {
//     //         res.set('content-type', response.headers['content-type']);
//     //       }
//     //       if (response.headers['content-length']) {
//     //         res.set('content-length', response.headers['content-length']);
//     //       }
//     //       if (response.body) {
//     //         res.send(response.body);
//     //       } else {
//     //         res.end();
//     //       }
//     //     })
//     //     .catch((err) => {
//     //       console.error(err);
//     //       const code = err.code || (err.response ? err.response.statusCode : 500) || 500;
//     //       res.status(code).send(err);
//     //       return Promise.reject(err);
//     //     });
//     // };

// });

