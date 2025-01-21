import {Router, Request, Response} from 'express';
import sendMessage from '../kafka/producer';
import consumer from '../kafka/consumer';

const router = Router();

//Sending a message
router.post('/send-message', (req:Request, res:Response): void => {
    const {message} = req.body;

    if(!message){
        res.status(400).json({message:'Message is required...'});
        return;
    }

    sendMessage(message);
    res.status(200).json({message:'Message sent to kafka.'});
    return;
});

//Fetching messages
router.get("/messages", async (req:Request, res:Response) =>{
    try{
        const messages: string[] = [];

        //fetch from consumer
        consumer.on("message", (message) =>{
            messages.push(message.value as string);
        });

        setTimeout(() => {
            res.status(200).json(messages);
        }, 500);
    }catch(err){
        res.status(500).json({message:"Error fetching messages.", err});
    }
});

export default router;