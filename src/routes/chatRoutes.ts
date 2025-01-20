import {Router, Request, Response} from 'express';
import sendMessage from '../kafka/producer';

const router = Router();

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

export default router;