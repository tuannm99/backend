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

    const queue = 'wildcard_queue'
    const ex = 'wildcard_ex'
    await channel.assertExchange(ex, 'topic', {
        durable: false
    })
    const routingPattern = ['tuan.*', '*.minh']

    for (const [i, k] of Object.entries(routingPattern)) {
        const q = await channel.assertQueue(`${queue}${i}`)
        await channel.bindQueue(q.queue, ex, k)

        await channel.consume(
            q.queue,
            function (msg) {
                const payload = msgParser.toObj(msg.content)
                console.log(`❤❤❤ tuannm: [index.js][50][payload] pattern=${k}:`, payload)
            },
            {
                noAck: true
            }
        )
    }

    const testConsume = ['tuan.minh', 'oke.minh', 'tuan.oke']

    for (const str of testConsume) {
        channel.publish(ex, str, msgParser.toBuffer({msg: `hello ${str}`}))
    }
}

run()
    .then(async () => {
        await Bluebird.delay(5000)
        process.exit(0)
    })
    .catch((e) => console.log(e))
