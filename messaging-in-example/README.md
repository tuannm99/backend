# Guide to messaging

```python3
1 - sudo chmod +x ./init.sh && ./init.sh
2 - goto each index file in src/ and run
```

### There some difference reasons to choose between Rabbitmq, Kafka and Nats

-   `Nats`: used for messaging with high performance, low latency (if payload of a message is small), if we need an messaging platform very simple and light weight, it built-in support pub/sub, req/reply, very easy to use. In core `Nats` we are not have persistent messages, but with `JetStream` enabled, `Nats` can take all advantages like Kafka and Rabbit, with `JetStream` `Nats` will be slower`.
-   `Rabbitmq`: used for needing complex routing pattern (payload of a message is small too).
-   `Kafka`: used for needing an Streaming platform (can be used as a Messaging platform). It only support pub/sub pattern, not have complex routing pattern, but sure it can process very large data and scale very well. It has more features like `Kafka Connect` for syncing data between resource, `Kafka Stream` for complex data processing, `KSQL` as a data source,...
