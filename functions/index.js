// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Parameter for Authentication
const maxScaleErr = 0.31;
const maxErr = 185;

// Listens for new tries added to /testsubjects/:userId/:patternId/:tryId and
// veriefies the try with the refcode
exports.verifyAuth = functions.database.ref('/testsubjects/{userId}/{patternId}/{tryId}/data')
    .onCreate(event => {

      let uid = event.params.userId;
      let patternId = event.params.patternId;
      let tryId = event.params.tryId;
      const tryData = event.data.val();

      console.log('Authorize: ', event.params.userId, event.params.patternId, event.params.tryId, tryData);
      return event.data.ref.parent.parent.child('/refcode')
        .once('value', refcodeSnap => {

          let refcode = refcodeSnap.val();

          //Fehlschlag bei ungleicher Länge
          if(refcode.length !== tryData.length) return;

          let lastIndex = refcode.length - 1;
          let lastErr = tryData[lastIndex] - refcode[lastIndex];

          //Fehlschlag falls Zeitfehler für Skalierung zu hoch
          if(Math.abs(lastErr) > refcode[lastIndex] * maxScaleErr) return;
          
          //Skalierung aller Werte und Fehlschlag bei zu großem Fehler
          let scale = refcode[lastIndex] / tryData[lastIndex];
          if(tryData.some((timestamp, index) => Math.abs((timestamp * scale) - refcode[index]) > maxErr)) return;

          //Passed Validation
          event.data.ref.parent.parent.child('/locked')
            .once('value', lockedSnap => {
              let locked = lockedSnap.val();
              event.data.ref.parent.parent.child('/locked').set(!locked);
            })
        })
    });