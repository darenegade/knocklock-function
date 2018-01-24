// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Listens for new tries added to /testsubjects/:userId/:patternId/:tryId and
// veriefies the try with the refcode
exports.verifyAuth = functions.database.ref('/testsubjects/{userId}/{patternId}/{tryId}/data')
    .onCreate(event => {

      let uid = event.params.userId;
      let patternId = event.params.patternId;
      let tryId = event.params.tryId;

      // Grab the current value of what was written to the Realtime Database.
      const tryData = event.data.val();
      console.log('Authorize: ', event.params.userId, event.params.patternId, event.params.tryId, tryData);
      
      //DO SOME MAGIC HERE


      //Just for Testing
      //Remove after Magic happens
      event.data.ref.parent.parent.child('locked').once('value', locked => {

        if(locked.val() === true) {
          return event.data.ref.parent.parent.child('locked').set(false);
        } else {
          return event.data.ref.parent.parent.child('locked').set(true);
        }

      })
    });