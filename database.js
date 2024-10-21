const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://dbonilla1988:dcBAP52L2py9yOiO@cluster0.i6pld.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        // Specify your database name
        const db = client.db("davidbonillajaylen2022"); // Your actual database name
        // Specify your collection name
        const collection = db.collection("transactions"); // Replace with your actual collection name

        // Insert a sample document
        const result = await collection.insertOne({ name: "Sample Data", value: 42 });
        console.log(`New document created with the following id: ${result.insertedId}`);

        // Optionally, you can fetch documents to verify insertion
        const documents = await collection.find().toArray();
        console.log("Documents in the collection:", documents);

    } catch (error) {
        console.error("Connection failed", error);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);