require("dotenv").config();


const { supabase } =require("./config/supabase");

const express= require("express");
const app = express();

app.use(express.json());

const PORT=8000;

app.listen(
    PORT,
    () => console.log(`it is live on Port ${PORT}`)
);

// 1 . create a task

app.post(
    "/tasks", 
     async (req,res) => {
        const {title, status, description, priority} = req.body;

        const allowedStatus=["pending","in-progress","completed"];
        const allowedPriority=["low","medium","high"];

        if(!title && title.trim() === ""){
            return res.status(400).json({
                message : "title is required"
            });
        };

        if(status && !allowedStatus.includes(status)){
            return res.status(400).json({
                message : "status must be one of pending, in- progress, completed"
            });
        };

        if(priority && !allowedPriority.includes(priority)){
            return res.status(400).json({
                message : "priority must be one of low, medium, high"
            });
        };

        const finalStatus = status || "pending";
        const finalpriority = priority || "low";

        const {data , error} = await supabase.from("tasks").insert([{
            title: title.trim(),
            status: finalStatus,
            description,
            priority: finalpriority,
        }]).select();

        if(error){
            return res.status(501).json(
                {
                    message: error.message
                }
            )
        };
        
        return res.status(201).json(data);
    }

);

// 2. get all tasks

app.get(
    "/tasks",
    async (req,res) => {
        const {status,priority,sort,order,page,limit} = req.query;

        const finalPage= parseInt(page) || 1;
        const finalLimit= parseInt(limit) || 10;

        const startRange=(finalPage-1)*finalLimit;
        const endRange=startRange+finalLimit-1;

        let query= supabase.from("tasks").select("*");

        if(status == "pending"){
            query = query.eq("status",status)
        } 

        if(priority == "high"){
            query = query.eq("priority",priority)
        } 
        if(sort){
            query = query.order(sort,{ascending: order === "asc" });
        };

        const {data,error} = await query.range(startRange,endRange);

        if(error){
            return res.status(400).json({
                message : error.message
            })
        }
        return res.status(200).json(data);
    });


// 3. get one task by id

app.get(
    "/tasks/:id",
    async (req,res) => {
        const {id} = req.params;

        const {data, error} = await supabase.from("tasks").select("*").eq("id" , id).single();

        if(error){
            return res.status(404).json({message: "task not found"});
        };
        return res.status(200). json(data);
    }
);

// 4. update task
app.put(
    "/tasks/:id",
    async (req , res) => {
        const {id}= req.params;
        const{title,status,description,priority} = req.body;

        const allowedStatus=["pending","in-progress","completed"];
        const allowedPriority=["low","medium","high"];

        if (!status || !title || !description || !priority){
            return res.status(400).json({
                message : "all field are required for update {title,status,description,priority}"
            })
        };

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message : "status must be one of pending, in- progress, completed"
            });
        };

        if( !allowedPriority.includes(priority)){
            return res.status(400).json({
                message : "priority must be one of low, medium, high"
            });
        };

        
        const {data,error} = await supabase
        .from("tasks").update(req.body).eq("id" , id).select();

        if(error){
            return res.status(400).json({
                message : error.message,
            });
        };

        return res.status(200).json(data);

    }
);

// 5. partially update
app.patch(
    "/tasks/:id",
    async (req , res) => {
        const {id}= req.params;
        const {status,priority}=req.body;

        const allowedStatus=["pending","in-progress","completed"];
        const allowedPriority=["low","medium","high"];

        if(status && !allowedStatus.includes(status)){
            return res.status(400).json({
                message : "status must be one of pending, in- progress, completed"
            });
        };

        if(priority &&!allowedPriority.includes(priority)){
            return res.status(400).json({
                message : "priority must be one of low, medium, high"
            });
        };

        const {data,error} = await supabase
        .from("tasks").update(req.body).eq("id" , id).select();

        if(error){
            return res.status(400).json({
                message : error.message,
            });
        };

        return res.status(200).json(data);

    }
);

// 6. delete task

app.delete(
    "/tasks/:id",
    async (req,res)=>{
        const {id} = req.params;
        
        const {data,error} = await supabase.from("tasks").delete().eq("id",id).select();

        if(error){
            return res.status(500).json({
                error : error.message
            });
        };

        if(!data || data.length === 0){
            return res.status(404).json({
                message : "task not found",
            })
        }


        return res.status(200).json({
            message : "task deleted",
            task: data,
        })
    }
);

// 7. get health

app.get(
    "/health",
    (req,res)=>{
        return res.json({
            status : "ok",
            message : "server running"
        })    
    }
);
