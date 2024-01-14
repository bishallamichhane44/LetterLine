const express = require('express');
const dotenv = require('dotenv');
const {default: mongoose} = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();
dotenv.config();
app.use(express.json());


const connectDb = async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("Server is connected to db");

    } catch(err){
        console.log("Server is not connected to Db", err.message);
    }
};

connectDb();

app.get("/", (req,res)=>{
    res.send("API is running");
});

app.use("/user",userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log("server is running.."));

