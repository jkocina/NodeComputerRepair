const express = require('express');
const router = express.Router();
const request = require('request');
const fs = require('fs');
const sgMail = require('@sendgrid/mail');

//This is testing for the environment variable set in a heroku environment
if (!process.env.SENDGRID_API_KEY) {

  //reading the sendGrid json file to get the sendgrid api key in development
  fs.readFile('data/sendgrid.json', 'utf8', function(err, data){

      if (err) {

        throw err;

      } else {

        config = JSON.parse(data);
        key = config[0].SENDGRID_API_KEY;

      }
  })

} else {

  key = process.env.SENDGRID_API_KEY;

}

/* GET contacts home page. */
router.get('/', function(req, res, next) {

  //rendering the contact page
  res.render('contact', {

    title: 'Contact'

  })
});

//sending Email through send grid
router.post('/send', function(req, res, next) {

  sgMail.setApiKey(key);

  //creating a variable from the email
  let toField = req.body.email;

  //setting the message information to send to the user
  const msg = {
    to: toField,
    from: 'us.business.intel@gmail.com',
    subject: 'Thanks for your message ' + req.body.name,
    text: 'This site demonstrates responsive design and css breakpoints. If you would like to read my blog, with links to other portfolio projects, please visit https://www.jacobkocina.com'
    //html: ''
    /* this is id referencing a template created in the send grid portal in heroku
    templateId: 'd-0f43a939ab074cb08620a32c4a40c6d6',
    dynamic_template_data: {
      subject: 'Thanks for visiting ' + req.body.name,
      message: req.body.message
    }*/
  }

  //setting the message information to send to myself
  const msg1 = {
    to: "Jkocina.jr@gmail.com",
    from: toField,
    subject: 'You have been send a message from ' + req.body.name + ' through your Heroku App',
    text: req.body.message
    //html:''
    /* this is id referencing a template created in the send grid portal in heroku
    templateId: 'd-0f43a939ab074cb08620a32c4a40c6d6',
    dynamic_template_data: {
      subject: 'Thanks for visiting ' + req.body.name,
      message: req.body.message
    }*/
  }

  //sending a message to the user and myself
  sgMail.send(msg);
  sgMail.send(msg1);

  //redirecting to the contact page
  res.redirect('/contact');

});

//this will upload a file and return its contents
var getKey = function() {

  if (!process.env.SENDGRID_API_KEY) {
    //reading the sendGrid json file if we are in production
    fs.readFile('data/sendgrid.json', 'utf8', function(err, data){
        if (err) {
          throw err;
        } else {
          config = JSON.parse(data);
          return config[0].SENDGRID_API_KEY;
        }
    })

  } else {
    return process.env.SENDGRID_API_KEY;
  }
};

module.exports = router;
