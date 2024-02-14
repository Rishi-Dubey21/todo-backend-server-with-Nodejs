const express = require("express");
const app=express();
const bodyparser=require("body-parser");
const fs=require("fs");
const port=3000;
app.use(bodyparser.json());

function get_tast(todos,id){
    for(let i=0;i<todos.length;i++){
        if(todos[i].id === id) return i;
    }
    return -1;
}

function func(todos,ind){
    let vari=[]
    for(let i=0;i<todos.length;i++){
        if(i !== ind) vari.push(todos[i]);
    }
    return vari;
}


app.get("/todos",(req,res)=>{
    fs.readFile("todos.json","utf-8",(err,data)=>{
        if(err){
            throw err;
        }else{
            res.json(JSON.parse(data));
        }
    })
    
})

app.get("/todos/:id",(req,res)=>{
    const id=parseInt(req.params.id);
    fs.readFile("todos.json","utf-8",(err,data)=>{
        if(err){
            throw err;
        }else{
            const todos=JSON.parse(data);
            const ind=get_tast(todos,id);
            if(ind === -1){
                res.status(404).send();
            }else{
                res.json(todos[ind]);
            }
        }
    })
})

app.post("/todos",(req,res)=>{
    const new_task={
        id:Math.floor(Math.random()*1000),
        title:req.body.title,
        description:req.body.description
    };
    fs.readFile("todos.json","utf-8",(err,data)=>{
        if(err) throw err;
        else{
            const todo=JSON.parse(data);
            todo.push(new_task);
            fs.writeFile("todos.json",JSON.stringify(todo),(err)=>{
                if(err) throw err;
                else res.status(201).json(new_task);
            })
        }
    })
})

app.put("/todos/:id",(req,res)=>{
    fs.readFile("todos.json","utf-8",(err,data)=>{
        if(err) throw err;
        const todo=JSON.parse(data);
        const id=parseInt(req.params.id);
        const ind=get_tast(todo,id);
        if(ind === -1){
            res.status(404).send();
        }else{
            todo[ind].title=req.body.title;
            todo[ind].description=req.body.description;
        }
        fs.writeFile("todos.json",JSON.stringify(todo),(err)=>{
            if(err) throw err;
            res.status(201).json(todo[ind]);
        })
    })
})

app.delete("/todos/:id",(req,res)=>{
    const val=parseInt(req.params.id);
    fs.readFile("todos.json","utf-8",(err,data)=>{
        if(err) throw err;
        let todo=JSON.parse(data);
        const ind = get_tast(todo,val);
        if(ind === -1){
            res.status(404).send();
        }else{
            todo=func(todo,ind);
            fs.writeFile("todos.json",JSON.stringify(todo),(err)=>{
                if(err) throw err;
                res.status(200).send();
            })
        }

    })
})

app.use('*',(req,res)=>{
    res.send("No such routes available");
})


app.listen(port,(req,res)=>{
    console.log(`The port is working on ${port}`);
})