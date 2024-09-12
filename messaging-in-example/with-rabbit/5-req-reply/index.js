const amqp = require('amqplib')
const {RABBIT_URI} = require('../constants')
const {msgParser} = require('../helpers')
const Bluebird = require('bluebird')

const connection = async () => {
    return await amqp.connect(RABBIT_URI)
}

const run = async (num) => {
    const con = await connection()

    const channel = await con.createChannel()

    var queue = 'rpc_queue'
    await channel.assertQueue(queue, {
        durable: false
    })
    await channel.prefetch(1)
    console.log(' [x] Awaiting RPC requests')
    await channel.consume(queue, async function reply(msg) {
        var n = parseInt(msg.content.toString())
        var r = calc(n)

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(r.toString()), {
            correlationId: msg.properties.correlationId
        })

        channel.ack(msg)
    })

    // reply queue
    const replyQ = await channel.assertQueue('', {exclusive: true})
    var correlationId = generateUuid()

    console.log(' [x] Requesting fib(%d)', num)
    await channel.consume(
        replyQ.queue,
        function (msg) {
            if (msg.properties.correlationId == correlationId) {
                console.log(' [.] Got %s', msg.content.toString())
            }
        },
        {
            noAck: true
        }
    )

    channel.sendToQueue('rpc_queue', Buffer.from(num.toString()), {
        correlationId: correlationId,
        replyTo: replyQ.queue
    })
}

function calc(n) {
    return n * 2
}

function generateUuid() {
    return Math.random().toString() + Math.random().toString() + Math.random().toString()
}

run(30)
    .then(async () => {
        await Bluebird.delay(5000)
        process.exit(0)
    })
    .catch((e) => console.log(e))
