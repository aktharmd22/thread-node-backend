const db = require('../db');

const getNotifications=(req,res)=>{
    const {id}=req.params
    const getQuery=`SELECT * FROM tickets 
    WHERE assigned_to = ? and status != "closed" order by id desc`
    db.query(getQuery,id,(err,results)=>{
        if(err){
            res.status(500).send(err);
            return;
        }
        res.send(results)
    })
}

module.exports={getNotifications}