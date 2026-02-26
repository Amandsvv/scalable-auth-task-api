import dotenv from 'dotenv'
dotenv.config({
    path: "./.env"
})
import connectDB from './database/db.js';
import { app } from './app.js';


const port = process.env.PORT || 3001;

connectDB()
.then(() =>{
    app.listen(port,() => {
        console.log(`Server is running on port : http://localhost:${port}`)
    })
}).catch((err) => {
    console.log("MongoDB connection failed : ",err)
})
