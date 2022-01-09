const express = require('express');
const helmet = require('helmet');
const amqp = require('amqplib');


const app = express();

app.use(helmet());
app.use(express.json());


const PORT = parseInt(process.env.QUEUE_PORT);
const RABBITMQ_URI = process.env.RABBITMQ_URI;
console.log("🚀 ~ RABBITMQ URI", RABBITMQ_URI)


const QUEUE = 'test-queue';

let channel, connection

const startConnection = async () => {
    console.log("Tring to connect RabbitMQ...");

    try {

        connection = await amqp.connect(RABBITMQ_URI);
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE, {
            durable: false
        })

        console.log("RabbitMQ is connected");
        app.listen(PORT, () => {
            console.log("Server is up on port", PORT);
        });

    }
    catch (error) {
        console.error("🚀 startConnection ~ Error:", error)
        setTimeout(startConnection, 3000);
    }

}

startConnection();


app.post('/echo', (req, res) => {
    console.log(`Body:  ${JSON.stringify(req.body, null, 4)}`)
    return res.status(200).send({ "echo": req.body ?? {} })
})

// app.post('/getData', getData);
app.post('/queueData', async (req, res) => {
    const data = req.body ?? {};

    const dataString = JSON.stringify(data, null, 4);
    try {
        await channel.sendToQueue(QUEUE, Buffer.from(dataString));
        console.log("🚀 ~ data queued")

        return res.sendStatus(201);
    }
    catch (error) {
        console.error("🚀 ~ error", error)
        return res.sendStatus(400);
    }
})

// app.post('/generateURL', generateNewUrl);
// app.get('/:id', getOrignalUrl);


// handle SIGINT
process.on('SIGINT', async () => {
    await channel.close();
    await connection.close();
    process.exit(0);
});