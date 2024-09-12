const kafka = require('node-rdkafka')
const {KAFKA_BROKER_LIST} = require('./constants')

class KafkaManager {
    /** @private */
    constructor(brokerList = KAFKA_BROKER_LIST) {
        /** @private */
        this.brokerList = brokerList
        /** @private */
        this.instance = null
    }

    /*
     * @returns {KafkaManager} instance
     */
    static getInstance(brokerList = KAFKA_BROKER_LIST) {
        if (!this.instance) {
            return new KafkaManager(brokerList)
        } else {
            return this.instance
        }
    }

    /**
     * @param {Object} arg
     * @param {kafka.ConsumerGlobalConfig} arg.config
     * @param {kafka.ConsumerTopicConfig} arg.topicConfig
     * @param {(arg: kafka.Message) => void} arg.onDataCallback
     * @returns {Promise<kafka.KafkaConsumer>} consumer
     */
    async createConsumer({config = {}, topicConfig = {}, onDataCallback}) {
        const consumer = new kafka.KafkaConsumer(
            {
                'metadata.broker.list': this.brokerList,
                ...config
            },
            {
                'auto.offset.reset': 'earliest',
                ...topicConfig
            }
        )

        return new Promise((resolve, reject) => {
            consumer
                .on('ready', () => {
                    console.log('consumer ready')
                    resolve(consumer)
                })
                .on('data', onDataCallback)
                .on('connection.failure', (err) => {
                    console.error('connection failure')
                    if (err) reject(err)
                })
                .on('event.error', (err) => {
                    console.error('Error from event', err)
                })
                .on('rebalance', (err, assignments) => {
                    if (err) {
                        console.error(`rebalance error=${JSON.stringify(err)}`)
                        return
                    }
                    console.log(`assignments: ${JSON.stringify(assignments)}`)
                })
                .on('offset.commit', (err, topicPartitions) => {
                    if (err) {
                        console.error(`offset commit error=${JSON.stringify(err)}`)
                        return
                    }
                    console.log(`topic pattitions: ${JSON.stringify(topicPartitions)}`)
                })

            consumer.connect({}, (err, meta) => {
                if (err) console.error(err)
                console.log(meta)
            })
        })
    }

    /**
     * @param {Object} arg
     * @param {kafka.ProducerGlobalConfig} arg.config
     * @param {kafka.ProducerTopicConfig} arg.topicConfig
     * @param {(err: kafka.LibrdKafkaError, report: kafka.DeliveryReport) => any} arg.onDeliveryReport
     * @returns {Promise<kafka.Producer>} producer
     */
    async createProducer({config = {}, topicConfig = {}, onDeliveryReport}) {
        const producer = new kafka.Producer(
            {
                'metadata.broker.list': this.brokerList,
                // 'allow.auto.create.topics': true,
                // 'client.id': 'kafka_client_id_default',
                // 'compression.codec': 'gzip',
                // 'retry.backoff.ms': 200,
                // 'message.send.max.retries': 10,
                // 'socket.keepalive.enable': true,
                // 'queue.buffering.max.messages': 100000,
                // 'queue.buffering.max.ms': 1000,
                // 'batch.num.messages': 1000000,
                dr_cb: true,
                ...config
            },
            {
                ...topicConfig
            }
        )

        return new Promise((resolve, reject) => {
            producer
                .on('ready', () => {
                    console.log('producer ready')
                    resolve(producer)
                })
                .on('connection.failure', (error, clientMetrics) => {
                    if (error) {
                        console.log('Connect failed', error)
                        return
                    }
                    console.log('clientMetrics', clientMetrics)
                })
                .on('delivery-report', onDeliveryReport)
                .on('event.error', (err) => {
                    console.warn('producer event.error', err)
                    reject(err)
                })
            // producer.setPollInterval(100)

            producer.connect()
        })
    }
}

module.exports = {
    KafkaManager
}
