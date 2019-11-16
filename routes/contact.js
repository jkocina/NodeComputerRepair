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

fs.readFile('data/sendgrid.json', 'utf8', function(err, data){
    if (err) {
      throw err;
    } else {

      config = JSON.parse(data);
    }
  });


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

/*
  var helper = require('sendgrid').mail;
  var from_email = new helper.Email('Fresh.Dev@aol.com');
  var to_email = new helper.Email(req.body.email);
  var subject = 'Hello World from the SendGrid Node.js Library!';
  var content = new helper.Content('text/plain', emailInfo);
  var mail = new helper.Mail(from_email, subject, to_email, content);

  var sg = require('sendgrid')(key);
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function(error, response) {
     console.log(response.statusCode);
     console.log(response.body);
     console.log(response.headers);
  });

  res.redirect('/contact');
});
  //THIS IS A REST CALL TO AN EMAIL SERVICE WORK IN PROGRESS

/*
THIS WAS SENDING THE FILE USING NODEMAILER
  var transporter = nodemailer.createTransport({
    service:  'Gmail',
    auth: {
      user: 'fromEmail',
      pass: 'emailPass'
    }
  });

  var mailOptions = {
    from: '"JacobKocina.com" <fromEmail>',
    to: 'toEMail',
    subject: 'Bob Lob Blah',
    text: 'You have a submission from... Name: ' + req.body.name + ' Email:' + req.body.email + ' Message:' + req.body.message,
    html: '<p>You have a submission from...</p><ul><li> Name: ' + req.body.name + '</li><li> Email:' + req.body.email + '</li><li> Message:' + req.body.message + '</li></ul>'
  }

  transporter.sendMail(mailOptions, function(error,info) {
    if (error) {
        return console.log(error);

    } else {

      console.log('Message Sent to me: ' + info.response);
    }
  });

  var userMailOptions = {
    from: '"JacobKocina.com" <us.business.intel@gmail.com>',
    to: req.body.email,
    subject: 'Thank you ' + req.body.name + ', for visting JacobKocina.com',
    html: emailInHTML
  }

  transporter.sendMail(userMailOptions, function(error,info) {
    if (error) {
        return console.log(error);

    } else {

      console.log('Message Sent to user: ' + info.response);

      res.redirect('/');
    }
  });
  */
//});

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
