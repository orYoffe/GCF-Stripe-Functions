
const stripe = require("stripe")("<YOUR PRIVATE KEY HERE>");
var Datastore = require('@google-cloud/datastore');
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "<YOUR PROJECT ID HERE>",
    clientEmail: "<YOUR SERVICE ACCOUNT EMAIL HERE>",
    privateKey: "<YOUR PROJECT ID HERE>"
  }),
  databaseURL: "<YOUR DATABASE URL HERE>"
});

const datastore = Datastore({
    projectId: "<YOUR PROJECT ID HERE>"
});

exports.createOrder = function createOrder(req, res) {

    var idToken = req.body.idToken;
    var items = req.body.items;

    admin.auth().verifyIdToken(idToken).then(function(decodedToken) {

      const userKey = datastore.key(['user', decodedToken.uid]);

      datastore.get(userKey).then((results) => {
        if (typeof results[0] === 'undefined') {
          Promise.reject(error)
        } else {
          return Promise.resolve(results[0].customerID)
        }
      }).then(function(customerID) {

        stripe.orders.create({
          currency: 'usd',
          items: items,
          customer: customerID
        }).then(function(order) {
          res.send('Created order.' + order);
        }).catch(function(error) {
          res.send('Could not create order.' + error);
        });

      }).catch(function(error) {
        res.send('User does not have account')
      });

  }).catch(function(error) {
        res.send('Hey, who are you?')
  });
};

