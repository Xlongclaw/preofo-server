require('dotenv').config()
import express from "express"

const server = express()


const PORT = process.env.PORT ?? 8080;

server.listen(PORT,()=>{
  console.log(`Preofo Server Listening on PORT : ${PORT}`);
})