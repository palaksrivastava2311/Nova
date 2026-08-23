import express from "express";
import "dotenv/config";
import cors from "cors";


const app = express();
const PORT = 8080;

app.use(express.json());
app.use(cors());

app.listen(PORT, ()=>{
  console.log(`server running on ${PORT}`);
});



// app.post("/test", async(req,res)=>{
//   const options = {
//     method: "POST",
//     headers: {
//       'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: "openrouter/free",
//       messages: [{
//         role: "user",
//         content:req.body.message
//       }]
//     })
//   };
//   try{
//   const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);
//   const data = await response.json();
//   // console.log(data.choices[0].message.content); // req
//   res.send(data.choices[0].message.content);
//   }catch(err){
//     console.log(err);
//   }
// });