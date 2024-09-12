const {KafkaManager} = require('../helper')

;(async () => {
    try {
        const kafkaManager = KafkaManager.getInstance()

        const consumer = await kafkaManager.createConsumer({
            config: {'group.id': 'group-id-2'},
            onDataCallback: (arg) => {
                const {value} = arg
                console.log(`Consumed event from topic ${topic}: value = ${value.toString()}`)
            }
        })
        const topic = 'topic-2'
        consumer.subscribe([topic])
        consumer.consume()

        const producer = await kafkaManager.createProducer({
            config: {'client.id': 'client-id-1'},
            onDeliveryReport: (e, _report) => {
                if (e) console.log(e.message)
            }
        })

        producer.produce(topic, null, Buffer.from(JSON.stringify({msg: 'Hello World'})))
        producer.poll()

        process.on('SIGINT', () => {
            console.log('\nDisconnecting consumer ...')
            consumer.disconnect(1000 * 3, (err) => {
                if (err) console.log(err)
            })
        })
    } catch (e) {
        console.log('❤❤❤ tuannm: [index.js][32][e]', e)
    }
})()
