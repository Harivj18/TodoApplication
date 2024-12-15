const {MongoClient} = require('mongodb');
const MongoConnection = 'mongodb+srv://adminhari:Thalapathy1@clusterhari.okn8gmb.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(MongoConnection);

const getDbConnection = async () => {
    try {
        await client.connect();
        const db = client.db('mongodb_Practice');
        const collections = db.collection('Users');
        console.log('Connection established Successfully');
        return Promise.resolve(collections);
    } catch (error) {
        console.log('Error while Establishing the Database Connection',error);
        throw error;
    }
}


module.exports = getDbConnection;