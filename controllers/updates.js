const db=require('../db')

const getUpdates=async(req,res)=>{
    const getQuery=`select updates.*,user.name from updates inner join user on user.id=updates.inserted_by order by created_at desc`
    db.query(getQuery,(err,results)=>{
        if(err){
            res.status(401).status(err)
        }
        
        res.send(results)
    })
}

const insertUpdates= async(req,res)=>{
    const {text,inserted_by}=req.body
    const insertQuery=`INSERT INTO updates(text,inserted_by) VALUES(?,?)`
    db.query(insertQuery,[text,inserted_by],(err,results)=>{
        if(err){
            res.status(401).status(err)
        }
        res.send("Inserted Successfully")
    })
}

module.exports ={insertUpdates,getUpdates}
