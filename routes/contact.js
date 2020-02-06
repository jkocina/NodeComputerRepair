const express = require('express');
const router = express.Router();
const request = require('request');
var fs = require('fs');


//This is information for the email
/*var emailInfo;
fs.readFile('data/email.html', 'utf8', function(err, data){
    if (err) {
      throw err;
    } else {

      emailInfo = data;
    }
  });
*/

if (!process.env.SENDGRID_API_KEY) {
  //reading the sendGrid json file if we are in production
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
  res.render('contact', {
    title: 'Contact'
  });
});

//sending Email
router.post('/send', function(req, res, next) {

  toField = req.body.email;

  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(key);
  const msg = {
    to: toField,
    from: 'us.business.intel@gmail.com',
    subject: 'Thanks for your message ' + req.body.name,
    text: 'This site is a site meant to demonstrate skills learned in a node JS environment. If you would like to read my blog, with links to other portfolio projects, please visit https://www.jacobkocina.com',
    html: '<h4>Like Tech?</h4><p>This site is a demonstration of an application created with:</p><ul><li>node.js</li><li>exress.js</li><li>git</li><li>gulp</li><li>pug</li><li>bootstrap</li></ul><p>To read my blog and link to more projects goto https://www.jacobkocina.com</p>'
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
function getKey() {
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
}

module.exports = router;
