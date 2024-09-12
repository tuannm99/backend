const amqp = require('amqplib')
const {RABBIT_URI} = require('../constants')

// piority queue means a message inside a queue got piority to delivery
// create piority queue by set `x-max-priority: number` to headers. number should be 1-5, but max is 255
// when send msg to a queue, add priority number to options
async function main() {
    try {
        const connection = await amqp.connect(RABBIT_URI)
        const channel = await connection.createChannel()
        const queue = 'priority_queue'

        // Ensure queue exists as priority queue
        await channel.assertQueue(queue, {durable: true, arguments: {'x-max-priority': 5}})

        // Send messages with different priorities
        function sendMessage(msg, priority) {
            channel.sendToQueue(queue, Buffer.from(msg), {persistent: true, priority})
            console.log(`Sent message: ${msg} with priority ${priority}`)
        }

        // Send messages
        sendMessage('Message 1', 1)
        sendMessage('Message 2', 3)
        sendMessage('Message 3', 2)
        sendMessage('Message 4', 5)
        sendMessage('Message 5', 4)

        console.log('Waiting for messages. To exit press CTRL+C')

        // Consume messages
        channel.consume(
            queue,
            (msg) => {
                if (msg !== null) {
                    const message = msg.content.toString()
                    const priority = msg.properties.priority
                    console.log(`Received message: ${message} with priority ${priority}`)
                    // Process message here
                    channel.ack(msg) // Acknowledge message
                }
            },
            {noAck: false}
        )
    } catch (error) {
        console.error(error)
    }
}

main()
