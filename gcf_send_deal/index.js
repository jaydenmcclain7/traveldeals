const {Firestore} =require('@google-cloud/firestore');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

exports.demoFirestoreTrigger = async (event, context) => {
    const triggerResource = context.resource;
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    console.log(`Function triggered by event on: ${triggerResource}`);
    console.log(`Event type: ${context.eventType}`);

    console.log(`All Regions:`);
    event.value.fields.location.arrayValue.values.forEach(async(c)=>{
        console.log(c.stringValue);
        let query = await queryFS(c.stringValue);
        console.log(query);
        query.forEach((person)=>{
            const msg = {
                to: person,
                from: process.env.SENDGRID_SENDER,
                subject: `Jayden McClain ${event.value.fields.headline.stringValue}`,
                text: `${event.value.fields.headline.stringValue}`,
                html: `${event.value.fields.headline.stringValue}`
              };
            
              // SEND THE MESSAGE THROUGH SENDGRID
              sgMail
              .send(msg)
              .then(() => {}, error => {
                console.error(error);
              });
        })
    })
}

async function queryFS(region) {
    const db = new Firestore({
        projectId: 'sp24-41200-jaydmccl-travel'
    })
    const subRef = db.collection('subscribers');

    const queryRef = subRef.where('watch_regions', 'array-contains', region);
    let newest = await queryRef.get().then( (querySnapshot)=>{
        let total = [];
        querySnapshot.forEach((doc) =>{
            total.push(doc.data())
        })
        return total
    });
    let finalQ = [];
    newest.forEach((value)=>{
        finalQ.push(value.email_address);
    });
    return finalQ;
}