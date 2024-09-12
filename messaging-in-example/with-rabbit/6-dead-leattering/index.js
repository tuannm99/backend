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

    const dlxExchangeName = 'dlx-exchange'
    const dlxEx = await channel.assertExchange(dlxExchangeName, 'direct', {durable: true})

    const exchange = await channel.assertExchange('dlx-queue-test', 'direct', {
        durable: true,
        autoDelete: false
    })
    const q = await channel.assertQueue('queue-for-test-dlx', {
        durable: true,
        arguments: {
            'x-message-ttl': 1000 * 5,

            'x-dead-letter-exchange': dlxExchangeName,
            'x-dead-letter-routing-key': 'queue-routing-dlx'
        }
    })
    const qDlx = await channel.assertQueue('queue-dlx-got-msg', {durable: true})

    // Bind qDlx to DLX Exchange to receive messages from DLX
    await channel.bindQueue(qDlx.queue, dlxEx.exchange, 'queue-routing-dlx')

    // Bind q to exchange and configure DLX for q
    await channel.bindQueue(q.queue, exchange.exchange, 'ex-direct-q-routing-key')
    await channel.consume(
        qDlx.queue,
        async (msg) => {
            const messageContent = msg.content.toString()
            console.log(`Received message: ${messageContent}`)
            channel.ack(msg)
        },
        {noAck: false}
    )

    // Publish a message to the exchange
    channel.publish(
        exchange.exchange,
        'ex-direct-q-routing-key',
        msgParser.toBuffer({msg: 'hello'})
    )
}

run()
    .then(async () => {
        await Bluebird.delay(5000)

        // process.exit(0)
    })
    .catch((e) => console.log(e))
