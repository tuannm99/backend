const Kafka = require('node-rdkafka')
const {KAFKA_BROKER_LIST} = require('../constants')
const Bluebird = require('bluebird')

// after reading `node-rdkafka` modules, I found myself was a fool.
// The lib itself always singleton, we can alway call new and pass configuration so don't tryna make it singleton:))
function createConsumer(config, onData) {
    const consumer = new Kafka.KafkaConsumer(config, {'auto.offset.reset': 'earliest'})

    return new Promise((resolve, reject) => {
        consumer
            .on('ready', () => {
                console.log('consumer ready')
                resolve(consumer)
            })
            .on('data', onData)
            .on('connection.failure', (err) => reject(err))

        consumer.connect()
    })
}

async function consume() {
    const config = {
        'metadata.broker.list': KAFKA_BROKER_LIST,
        'group.id': 'kafka_client_id_1'
    }

    //let seen = 0;
    let topic = 'purchases'

    const consumer = await createConsumer(config, ({key, value}) => {
        let k = key.toString().padEnd(10, ' ')
        console.log(`Consumed event from topic ${topic}: key = ${k} value = ${value}`)
    })

    consumer.subscribe([topic])
    consumer.consume()

    process.on('SIGINT', () => {
        console.log('\nDisconnecting consumer ...')
        consumer.disconnect()
    })
}

function createProducer(config, onDeliveryReport) {
    const producer = new Kafka.Producer(config)

    return new Promise((resolve, reject) => {
        producer
            .on('ready', () => resolve(producer))
            .on('delivery-report', onDeliveryReport)
            .on('event.error', (err) => {
                console.warn('event.error', err)
                reject(err)
            })
        producer.connect()
    })
}

async function produce() {
    const config = {
        'metadata.broker.list': KAFKA_BROKER_LIST,
        'group.id': 'group-1',
        dr_msg_cb: true
    }

    let topic = 'purchases'

    let users = ['eabara', 'jsmith', 'sgarcia', 'jbernard', 'htanaka', 'awalther']
    let items = ['book', 'alarm clock', 't-shirts', 'gift card', 'batteries']

    const producer = await createProducer(config, (err, report) => {
        if (err) {
            console.warn('Error producing', err)
        } else {
            const {topic, key, value} = report
            let k = key.toString().padEnd(10, ' ')
            console.log(`Produced event to topic ${topic}: key = ${k} value = ${value}`)
        }
    })

    let numEvents = 10
    for (let idx = 0; idx < numEvents; ++idx) {
        const key = users[Math.floor(Math.random() * users.length)]
        const value = Buffer.from(items[Math.floor(Math.random() * items.length)])

        producer.produce(topic, -1, value, key)
    }

    producer.flush(10000, () => {
        producer.disconnect()
    })
}

consume()
    .then(async () => {
        produce()
            .then()
            .catch((err) => {
                console.error(`Something went wrong:\n${err}`)
                process.exit(1)
            })

        await Bluebird.delay(5000)
        process.exit(1)
    })
    .catch((err) => {
        console.error(`Something went wrong:\n${err}`)
        process.exit(1)
    })
