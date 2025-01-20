import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import transactionRoutes from "./routes/transactionRoutes";
import chatRoutes from "./routes/chatRoutes";
import './kafka/consumer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

//middleware
app.use(bodyParser.json());
app.use("/api", transactionRoutes);
app.use("/api/chat", chatRoutes);

//test route
app.get("/", (req, res) => {
    res.send("Finance Chat App is running!");
});

//Start Server
app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}.`);
});