const express = require('express');
const router = express.Router();
const request = require('request');
var fs = require('fs');


//This is information for the email
var emailInfo;
fs.readFile('data/email.html', 'utf8', function(err, data){
    if (err) {
      throw err;
    } else {

      emailInfo = data;
    }
  });

var config;

//Testing for the heroku environment variables
if (!process.env.SENDGRID_API_KEY) {
  //reading the sendGrid json file if we are in production
  fs.readFile('data/sendgrid.json', 'utf8', function(err, data){
      if (err) {
        throw err;
      } else {

        config = JSON.parse(data);
      }
  });
}



/* GET contacts home page. */
router.get('/', function(req, res, next) {
  res.render('contact', {
    title: 'Contact'
  });
});

//sending Email
router.post('/send', function(req, res, next) {

  key = getKey(config[0].SENDGRID_API_KEY, process.env.SENDGRID_API_KEY);
  toField = req.body.email;

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(key);
  const msg = {
    to: toField,
    from: 'us.business.intel@gmail.com',
    subject: 'Hi',
    text: 'Feel free to stop by jacobkocina.com anytime'
    /*
    templateId: 'd-0f43a939ab074cb08620a32c4a40c6d6',
    dynamic_template_data: {
      subject: 'Thanks for visiting ' + req.body.name,
      message: req.body.message
    }*/
  };
  sgMail.send(msg);

  res.redirect('/contact');

});


//this will upload a file and return its contents
function getKey(local, server) {
  if (local) {
    return local;
  } else if (server) {
    return server;
  } else {
    console.log("key not found");
  }


}

module.exports = router;
