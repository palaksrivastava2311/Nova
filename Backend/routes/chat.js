import express from "express";
import Thread from "../models/Thread.js";
import getOpenRouterAPIResponse from "../utils/openrouter.js";

const router = express.Router();
// test 

router.post("/test", async(req,res)=>{
    try{
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing New Thread"
        });
        const response = await thread.save();
        res.send(response);
    } catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to save in DB"});
    }
});

// Get all threads
router.get("/thread", async(req,res)=>{
    try{
        let threads = await Thread.find({}).sort({updatedAt:-1});
        //descending order of updatedAt...most recent data on top
        res.json(threads);
    } catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to fetch threads"});
    }
});

// Get particular thread
router.get("/thread/:threadId", async(req,res)=>{
    const {threadId} = req.params;
    try{
       const thread = await Thread.findOne({threadId});
       if(!thread){
            res.status(404).json({error: "Thread not found"});
       }
       res.json(thread.messages);
    } catch(err){
        console.log(err);
        res.status(500).json({error:"Failed to fetch chat"});
    }
});

// delete a particular thread
router.delete("/thread/:threadId", async(req,res)=>{
    const {threadId} = req.params;
    try{
        const deletedThread = await Thread.findOneAndDelete({threadId});

        if(!deletedThread){
            return res.status(404).json({error: "Thread not found"});
        }
        res.status(200).json({success:"Thread deleted successfully"});
    } catch(err){
        console.log(err);
        res.status(500).json({error: "Failed to delete thread"});
    }
});

// create a thread or get reply from assistant
router.post("/chat", async(req,res)=>{
    const {threadId, message} = req.body;
    if(!threadId || !message){
        return res.send(400).json({error: "missing required fields"});
    }
    try{
        let thread = await Thread.findOne({threadId});
        if(!thread){
            // create new thread in Db
            thread = new Thread({
                threadId,
                title:message,
                messages:[{role: "user", content: message}]
            });
        }else{
            thread.messages.push({role:"user", content: message});
        }
        const assistantReply = await getOpenRouterAPIResponse(message);
        const cleanReply = assistantReply.replace(/\u202f/g, " ");
        thread.messages.push({role:"assistant", content: cleanReply});
        thread.updatedAt = new Date();

        await thread.save();
        res.json({reply: cleanReply});
    }catch(err){
        console.log(err);
        res.status(500).json({error: "something went wrong"});
    }
});

export default  router;