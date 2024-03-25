const {Firestore} = require('@google-cloud/firestore');
require('dotenv').config();

exports.writeToFS = async (message, context)=>{
    const firestore = new Firestore({
        projectId: "sp24-41200-jaydmccl-travel",
        // databaseId: "whatever"
    });
    const incomingMessage = Buffer.from(message.data, 'base64').toString('utf-8');
    const parsedMessage = JSON.parse(incomingMessage);
    console.log(parsedMessage.watch_regions);
    let dataObject = {};
    dataObject.email_address = parsedMessage.email_address;
    dataObject.watch_regions = parsedMessage.watch_regions;
    let collectionRef = firestore.collection('subscribers');
    let documentRef = await collectionRef.add(dataObject);
    console.log(`Document created: ${documentRef.id}`);
}