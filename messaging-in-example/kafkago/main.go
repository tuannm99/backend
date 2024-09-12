package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/segmentio/kafka-go"
)

var (
	kafkaURL = "kafka-0-internal:9092"
	topic    = "topic-1"
)

func createTopic() {
	dialer := &kafka.Dialer{
		Timeout: 10 * time.Second,
	}

	conn, err := dialer.DialContext(context.Background(), "tcp", kafkaURL)
	if err != nil {
		log.Fatalf("Failed to connect to Kafka: %v", err)
	}
	defer conn.Close()

	controller, err := conn.Controller()
	if err != nil {
		log.Fatalf("Failed to get Kafka controller: %v", err)
	}

	controllerConn, err := dialer.DialContext(context.Background(), "tcp", net.JoinHostPort(controller.Host, strconv.Itoa(controller.Port)))
	if err != nil {
		log.Fatalf("Failed to connect to Kafka controller: %v", err)
	}
	defer controllerConn.Close()

	topicConfigs := []kafka.TopicConfig{
		{
			Topic:             topic,
			NumPartitions:     3,
			ReplicationFactor: 1,
		},
	}

	err = controllerConn.CreateTopics(topicConfigs...)
	if err != nil {
		log.Fatalf("Failed to create topics: %v", err)
	}

	fmt.Println("Topic created successfully!")
}

func produceMessages() {
	dialer := &kafka.Dialer{
		Timeout: 10 * time.Second,
	}

	writer := kafka.NewWriter(
		kafka.WriterConfig{
			Brokers:  []string{kafkaURL},
			Dialer:   dialer,
			Topic:    topic,
			Balancer: &kafka.RoundRobin{},
		},
	)

	defer writer.Close()

	fmt.Println("Start producing ... !!")

	for i := 0; ; i++ {
		key := fmt.Sprintf("Key-%d", i)

		msg := kafka.Message{
			Key:   []byte(key),
			Value: []byte(fmt.Sprint(uuid.New())),
		}
		err := writer.WriteMessages(context.Background(), msg)

		if err != nil {
			fmt.Println("Error producing message:", err)
		} else {
			fmt.Println("Produced", key)
		}
		time.Sleep(1 * time.Second)
	}
}

func consumeMessages() {
	groupID := "group-1"

	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{kafkaURL},
		GroupID: groupID,
		Topic:   topic,
		Dialer: &kafka.Dialer{
			Timeout: 10 * time.Second,
		},
		MinBytes: 1,
		MaxBytes: 10e6,
	})

	defer reader.Close()

	fmt.Println("Start consuming ... !!")

	batchSize := 10
	ctx := context.Background()

	for {
		var messages []kafka.Message

		// Read messages in a batch
		for i := 0; i < batchSize; i++ {
			msg, err := reader.FetchMessage(ctx)
			if err != nil {
				log.Println("Error fetching message:", err)
				break
			}
			messages = append(messages, msg)
			fmt.Printf("Fetched message: key=%s value=%s offset=%d partition=%d\n", string(msg.Key), string(msg.Value), msg.Offset, msg.Partition)
		}

		// Process messages after fetching the batch
		for _, msg := range messages {
			// Process each message (e.g., print or store it)
			fmt.Printf("Processing message: key=%s value=%s offset=%d partition=%d\n", string(msg.Key), string(msg.Value), msg.Offset, msg.Partition)
		}

		// Commit offsets for all messages in the batch
		if len(messages) > 0 {
			if err := reader.CommitMessages(ctx, messages...); err != nil {
				log.Println("Failed to commit messages:", err)
			} else {
				fmt.Println("Committed offsets for the batch.")
			}
		}
	}

	// for {
	// 	msg, err := reader.ReadMessage(context.Background())
	// 	if err != nil {
	// 		log.Println("Error reading message:", err)
	// 		break
	// 	}
	// 	fmt.Printf("Consumed message: key=%s value=%s offset=%d partition=%d\n", string(msg.Key), string(msg.Value), msg.Offset, msg.Partition)
	// }
}

func main() {
	createTopic()

	go produceMessages()
	go consumeMessages()

	select {} // Block forever
}
