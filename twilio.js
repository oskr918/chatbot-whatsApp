require('dotenv').config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

console.log(process.env.ACCOUNT_SID);

const client = require('twilio')(accountSid, authToken);

function sendTextMessage(sender, message){
  return new Promise((resolve, reject) => {
    client.messages
  .create({
     from: 'whatsapp:+14155238886',
     body: message,
     to: 'whatsapp:+' + sender,
   })
  .then(message => resolve()).catch((err)=>reject(err))
  });
}

module.exports = {
  sendTextMessage
};
