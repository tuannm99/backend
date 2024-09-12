const amqp = require('amqplib')
const {RABBIT_URI} = require('../../constants')
const {msgParser} = require('../../helpers')
const Bluebird = require('bluebird')

const connection = async () => {
    return await amqp.connect(RABBIT_URI)
}

const run = async () => {
    const con = await connection()
    const channel = await con.createConfirmChannel()

    const queue = 'confirm_channel_queue'
    const ex = 'confirm_channel_ex'
    await channel.assertExchange(ex, 'fanout', {
        durable: false
    })

    const q = await channel.assertQueue(queue)
    await channel.bindQueue(q.queue, ex, '')
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

    channel.publish(
        ex,
        '',
        msgParser.toBuffer({msg: 'hello'}),
        {deliveryMode: 2, mandatory: true},
        (err, _) => {
            if (err) console.log(err)
            // if publish success it should go here
            console.log('❤❤❤ --> pub')
        }
    )
    // if we are not specify callback inside publish (only available in confirmChannel) we should call this method
    await channel.waitForConfirms() // how to test >??
}

run()
    .then(async () => {
        await Bluebird.delay(5000)
        process.exit(0)
    })
    .catch((e) => console.log(e))
