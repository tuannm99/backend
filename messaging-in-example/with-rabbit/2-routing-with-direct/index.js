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
    const exchange = await channel.assertExchange('ex-direct', 'direct', {
        durable: true,
        autoDelete: false
    })

    const q = await channel.assertQueue('ex-direct-q', {
        durable: true
    })
    const q2 = await channel.assertQueue('ex-direct-q-2', {
        durable: true
    })

    channel.bindQueue(q.queue, exchange.exchange, 'ex-direct-q-routing-key')
    channel.bindQueue(q2.queue, exchange.exchange, 'ex-direct-q-routing-key-2')

    await channel.consume(
        q.queue,
        (msg) => {
            const payload = msgParser.toObj(msg.content)
            console.log('❤❤❤ tuannm: [index.js][50][payload]', payload)
        },
        {noAck: true}
    )

    await channel.consume(
        q2.queue,
        (msg) => {
            const payload = msgParser.toObj(msg.content)
            console.log('❤❤❤ tuannm: [index.js][50][payload]', payload)
        },
        {noAck: true}
    )

    channel.publish(
        exchange.exchange,
        'ex-direct-q-routing-key',
        msgParser.toBuffer({msg: 'hello'})
    )

    await Bluebird.delay(1000)
    channel.publish(
        exchange.exchange,
        'ex-direct-q-routing-key-2',
        msgParser.toBuffer({msg: 'hello'})
    )
}

run()
    .then(async () => {
        await Bluebird.delay(5000)

        process.exit(0)
    })
    .catch((e) => console.log(e))
