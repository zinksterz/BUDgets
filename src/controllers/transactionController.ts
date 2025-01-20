import {Request, Response} from "express";
import {v4 as uuidv4} from "uuid";
import {DynamoDBClient, PutItemCommand, ScanCommand, UpdateItemCommand} from "@aws-sdk/client-dynamodb";
import dynamoClient from "../db/dynamoClient";
import {Transaction} from "../models/transaction";

//Add a transaction
export const addTransaction = async (req:Request , res: Response): Promise<void> => {
    const {product, price, reason} = req.body;

    if(!product || !price || !reason){
        res.status(400).json({message: "Missing required fields."});
        return;
    }

    const newTransaction: Transaction = {
        id: uuidv4(),
        product,
        price,
        reason,
        status: "pending",
        timestamp: new Date().toISOString(),
    };

    try{
        const params = {
            TableName: "transactions",
            Item: {
                id: { S: newTransaction.id},
                product: {S: newTransaction.product},
                price: {N: newTransaction.price.toString()},
                reason: {S: newTransaction.reason},
                status: {S: newTransaction.status},
                timestamp: {S: newTransaction.timestamp},
            },
        };
        await dynamoClient.send(new PutItemCommand(params));
        res.status(201).json(newTransaction);
    }catch(error){
        res.status(500).json({message: "Error adding transaction.", error});
    }
};

//getAllTransactions
export const getTransactions = async (req:Request , res: Response): Promise<void> => {
    try{
        const params = {TableName: "transactions"};
        const data = await dynamoClient.send(new ScanCommand(params));
        const transactions = data.Items?.map(item => ({
            id: item.id.S,
            product: item.product.S,
            price: item.price ? Number(item.price.N): null,
            reason: item.reason.S,
            status: item.status.S,
            timestamp: item.timestamp.S,
        }));
        res.status(200).json(transactions);
    }catch(error){
        res.status(500).json({message: "Error retrieving transactions.", error});
    }
};

//Update transactions status
export const updateTransaction = async (req:Request , res: Response): Promise<void> => {
    const {id} = req.params;
    const {status} = req.body;

    if(!status || !["pending", "approved", "rejected"].includes(status)) {
        res.status(400).json({message: "Invalid status."});
        return;
    }

    try{
        const params = {
            TableName: "transactions",
            Key: {id: {S: id}},
            UpdateExpression: "SET #s = :status",
            ExpressionAttributeNames: {"#s": "status"},
            ExpressionAttributeValues: {":status": {S: status}},
        };
        await dynamoClient.send(new UpdateItemCommand(params));
        res.status(200).json({message:"Transaction updated successfully."});
    }catch(error){
        res.status(500).json({message: "Error updating status.", error});
    }
};