const db = require('../db');

const getIssue = (req, res) => {
    const { customer_id} = req.params
    const getQuery = `SELECT issue_notes.*, user.name FROM issue_notes inner join user on user.id = issue_notes.added_by
        WHERE customer_id = ? `
    db.query(getQuery, [customer_id], (err, results) => {
        if (err) {
            res.status(400).send(err)
        }
        res.send(results)
    })

}

const insertIssue = (req, res) => {
    const { text, added_by, ticket_id,customer_id } = req.body
    const insertQuery = `insert into issue_notes(text,added_by,ticket_id,customer_id)
    values(?,?,?,?)
    `
    db.query(insertQuery, [text, added_by, ticket_id,customer_id], (err, results) => {
        if (err) {
            res.status(500).send(err)
        }
        res.send("Details inserted successfully")
    })
}

module.exports = { insertIssue, getIssue }