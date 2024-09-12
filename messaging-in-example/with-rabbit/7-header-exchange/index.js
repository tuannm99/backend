const amqp = require('amqplib')
const {RABBIT_URI} = require('../constants')
const {msgParser} = require('../helpers')
const Bluebird = require('bluebird')

const connection = async () => {
    return await amqp.connect(RABBIT_URI)
}

const run = async () => {
    const con = await connection()

    const channel = await con.createChannel()

    const exchangeName = 'header_exchange'
    const queueName = 'header_queue'

    // Declare the header exchange with type 'headers'
    await channel.assertExchange(exchangeName, 'headers', {
        durable: false
    })

    const q = await channel.assertQueue(queueName)
    // Bind the queue to the exchange with specific header conditions
    await channel.bindQueue(q.queue, exchangeName, '', {
        'x-match': 'any', // 'any' or 'all' depending on your header conditions
        header1: 'value1', // Replace with your actual header and value
        header2: 'value2' // Replace with your actual header and value
    })

    await channel.consume(
        q.queue,
        function (msg) {
            const payload = msgParser.toObj(msg.content)
            console.log('❤❤❤ tuannm: [index.js][50][payload]', payload)
        },
        {
            noAck: true
        }
    )

    // Publish a message with specific headers
    const message = {msg: 'hello'}
    // For header exchange, routing key is not used
    channel.publish(exchangeName, '', msgParser.toBuffer(message), {
        headers: {
            header1: 'value1', // Match with binding header conditions
            header2: 'value2' // Match with binding header conditions
        }
    })
}

run()
    .then(async () => {
        await Bluebird.delay(5000)
        process.exit(0)
    })
    .catch((e) => console.log(e))
