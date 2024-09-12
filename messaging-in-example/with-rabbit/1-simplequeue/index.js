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

    const queue = 'simple_queue'

    const q = await channel.assertQueue(queue)
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

    channel.sendToQueue(queue, msgParser.toBuffer({msg: 'hello'}))
}

run()
    .then(async () => {
        await Bluebird.delay(5000)
        process.exit(0)
    })
    .catch((e) => console.log(e))
