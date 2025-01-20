import express from "express";
import { addTransaction, getTransactions, updateTransaction} from "../controllers/transactionController";

const router = express.Router();

//routes
router.post("/transactions", addTransaction);//add new transaction
router.get("/transactions", getTransactions); //get all transactions
router.patch("/transactions/:id", updateTransaction); //update a transaction's status

export default router;