const kafka = require('node-rdkafka')
// const kafkaConnect = require('kafka-connect')
// const kafkaStream = require('kafka-streams')
// const kstream = new kafkaStream.KStream()
// const ktable = new kafkaStream.KTable()

const consumer = new kafka.KafkaConsumer()
consumer.connect()
consumer.on('subscribed', (topics) => {
    console.log(`subscribed topics ${JSON.stringify(topics, null, 2)}`)
})
// const producer = new kafka.Producer()
// producer.on('connection.failure', (error, clientMetrics) => {})

// const admin = kafka.AdminClient.create({"log.connection.close"})
// admin.createTopic()
