const db = require('../db')

const getUserVisitedDetails= (req,res)=>{
    const getQuery=`SELECT * FROM user_visited_customer`
    db.query(getQuery,(err,results)=>{
        if(err){
            res.status(401).send(err)
        }
        res.send(results)
    })
}

const insertUserVisitedTime = (req, res) => {
    const { customer_id, user_id } = req.body
    const insertQuery = `INSERT INTO user_visited_customer(customer_id,user_id)
    VALUES(?,?)`
    db.query(insertQuery, [customer_id, user_id], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.send("inserted successfully")
    })
}


module.exports = {getUserVisitedDetails,insertUserVisitedTime}