const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const amqp = require('amqplib');

const { getData, saveData } = require('./controllers/testData.controller');
const { generateNewUrl, getOrignalUrl } = require('./controllers/urlShortner.controller');

const app = express();

app.use(helmet());
app.use(express.json());


const PORT = parseInt(process.env.PORT);
const MONGODB_URI = process.env.MONGODB_URI;
console.log("🚀 ~ MONGODB_URI", MONGODB_URI)

const RABBITMQ_URI = process.env.RABBITMQ_URI;
console.log("🚀 ~ RABBITMQ URI", RABBITMQ_URI)

let channel, connection;

const QUEUE = 'test-queue';

const startConnection = async () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true
    }

    try {

        console.log("Tring to connect MongoDB...");
        const dbConnection = mongoose.connect(MONGODB_URI, options)

        console.log("MongoDB is connected");

        connection = await amqp.connect(RABBITMQ_URI);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, {
            durable: false
        })

        console.log("RabbitMQ is connected");

        channel.consume(QUEUE, async data => {

            // delay
            for (i=0; i< 1000000000; ++i);
            console.log("🚀 ~ Received data", Buffer.from(data.content).toString())
            channel.ack(data);
        })

        process.on('close-db', async () => {
            console.log('Closing MongoDB connection...')
            await dbConnection.disconnect()
                .then(() => {
                    console.log('MongoDB connection closed')
                    process.exit(0);
                })
                .catch(e => {
                    console.log("🚀 exit error", e)
                    process.exit(1);
                })
            await channel.close();
            await connection.close();
        })

        app.listen(PORT, () => {
            console.log("Server is up on port", PORT);
        });
    }
    catch (err) {
        console.log("🚀  startConnection ~ error", err)
        setTimeout(startConnection, 3000);
    }

}

startConnection();


app.post('/echo', (req, res) => {
    console.log(`Body:  ${JSON.stringify(req.body, null, 4)}`)
    return res.status(200).send({ "echo": req.body ?? {} })
})

app.post('/getData', getData);
app.post('/saveData', saveData)

// app.post('/generateURL', generateNewUrl);
// app.get('/:id', getOrignalUrl);


// handle SIGINT
process.on('SIGINT', function () {
    process.emit('close-db')
});