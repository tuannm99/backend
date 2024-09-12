const amqp = require('amqplib')
const {RABBIT_URI} = require('../constants')

// lazy queue means Rabbitmq save message to disk as early as possible, which means delivery message to consumer slower
// its reduce cost to Rabbitmq server. If a background job or consumer no need to consume message as soon as possible,
// -> we can use lazy queue (some DLX can be lazy queue)
// `Lazy Queue` can be define by the UI, or when create queue set `x-queue-mode: 'lazy'` to the headers
async function main() {
    try {
        const connection = await amqp.connect(RABBIT_URI)
        const channel = await connection.createChannel()
        const queue = 'lazy_queue'

        // Ensure queue exists as lazy queue
        await channel.assertQueue(queue, {durable: true, arguments: {'x-queue-mode': 'lazy'}})

        // Producer sending message
        function sendMessage(msg) {
            channel.sendToQueue(queue, Buffer.from(msg), {persistent: true})
            console.log(`Sent message: ${msg}`)
        }

        // Consumer receiving and processing message
        console.log(`Waiting for messages in ${queue}. To exit press CTRL+C`)
        channel.consume(
            queue,
            (msg) => {
                if (msg !== null) {
                    const message = msg.content.toString()
                    console.log(`Received message: ${message}`)
                    // Process message here
                    channel.ack(msg) // Acknowledge message
                }
            },
            {noAck: false}
        )

        // Example: Send a message every 5 seconds
        setInterval(() => {
            sendMessage(`Hello from producer at ${new Date().toLocaleTimeString()}`)
        }, 5000)
    } catch (error) {
        console.error(error)
    }
}

main()
