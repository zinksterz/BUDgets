import {DynamoDBClient} from "@aws-sdk/client-dynamodb";
import dotenv from "dotenv";

dotenv.config();

const dynamoClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
});

export default dynamoClient;