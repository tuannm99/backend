// NO CODE Explain
// delay queue means message go to an special exchange, push to the queue after a initial time
//
// 1. it not built-in, first we need to enable plugin => rabbitmq-plugins enable rabbitmq_delayed_message_exchange
// 2. create an exchange with extra args:  {"x-delayed-type": "direct"}
// 3. publish with headers: {"x-delay": 5000}
