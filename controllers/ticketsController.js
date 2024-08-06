const db = require('../db');

const getTicketsById = async (req, res) => {
    const { customer_id, email_address } = req.params
    const userId = await new Promise((resolve, reject) => {
        const getQuery1 = `SELECT id FROM user where email_address like  ?`
        db.query(getQuery1, [email_address], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        })
    })

    const adminId = await new Promise((resolve, reject) => {
        const getQuery1 = `SELECT id FROM user where is_admin=1  `
        db.query(getQuery1, (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        })
    })



    const listOfAdmin = adminId.map(each => each.id)

    if (listOfAdmin.includes(userId[0].id) === true) {
        const final = await new Promise((resolve, reject) => {
            const getQuery = `SELECT tickets.*, user.name FROM tickets inner join user on user.id=tickets.assigned_to  where tickets.customer_id =?  order by tickets.id desc `
            db.query(getQuery, [customer_id, userId[0].id], (err, results) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve(results)
            })
        })
        res.send(final)
    } else {
        const final = await new Promise((resolve, reject) => {
            const getQuery = `SELECT tickets.*, user.name FROM tickets inner join user on user.id=tickets.assigned_to  where tickets.customer_id =? and tickets.assigned_to=?   order by tickets.id desc `
            db.query(getQuery, [customer_id, userId[0].id], (err, results) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve(results)
            })
        })
        res.send(final)
    }


}

const insertTickets = (req, res) => {
    const { ...items } = req.body
    const columns = Object.keys(items).join(', ');
    const placeholders = Object.keys(items).map(() => '?').join(', ');
    const values = Object.values(items);

    const insertQuery = `INSERT INTO tickets(${columns}) VALUES(${placeholders});`;
    db.query(insertQuery, values, (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }


        res.send('Tickets inserted successfully');
    });
}

const updateTickets=(req,res)=>{
    const{id,status}=req.body
    const updateQuery=`UPDATE tickets SET status=? where id= ?`
    db.query(updateQuery,[status,id],(err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send('User not found');
            return;
        }

        res.send('Tickets Updated successfully');
    });
}


module.exports = { insertTickets, getTicketsById,updateTickets }