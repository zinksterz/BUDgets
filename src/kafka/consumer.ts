import kafka, {KafkaClient, Consumer, Message} from 'kafka-node';

//create client
const client: KafkaClient = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});

//create consumer
const consumer: Consumer = new kafka.Consumer(
    client,
    [
        {topic: 'chat-messages', partition: 0},
    ],
    {autoCommit: true}
);

//listen for message
consumer.on('message', (message) => {
    console.log('Received Message:', message.value);
});

consumer.on('error', (err) => {
    console.error('Kafka Consumer error: ', err);
});

export default consumer;