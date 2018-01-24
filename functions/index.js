// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Listens for new tries added to /testsubjects/:userId/:patternId/:tryId and
// veriefies the try with the refcode
exports.verifyAuth = functions.database.ref('/testsubjects/{userId}/{patternId}/{tryId}/data')
    .onWrite(event => {

      let uid = event.params.userId;
      let patternId = event.params.patternId;
      let tryId = event.params.tryId;

      // Grab the current value of what was written to the Realtime Database.
      const original = event.data.val();
      console.log('Authorize: ', event.params.userId, event.params.patternId, event.params.tryId, original);
      
      //DO SOME MAGIC HERE

      return event.data.ref.parent.child('locked').set(true);
    });