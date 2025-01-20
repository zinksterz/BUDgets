import kafka, {KafkaClient, Producer, ProduceRequest} from 'kafka-node';

//create client
const client: KafkaClient = new kafka.KafkaClient({kafkaHost: 'localhost:9092'});

//create producer
const producer: Producer = new kafka.Producer(client);

producer.on('ready', () => {
    console.log("Kafka producer is ready.");
});

producer.on('error', (err) => {
    console.error('Kafka Producer error.');
});

//Sending message
const sendMessage = (message: string): void => {
    const payloads: ProduceRequest[] = [
        {
            topic: 'chat-messages',
            messages: message,
        },
    ];

    producer.send(payloads, (err: Error | null, data: any) =>{
        if(err){
            console.error("Error sending message:", err);
        } else{
            console.log("Message sent:", data);
        }
    });
};

export default sendMessage;