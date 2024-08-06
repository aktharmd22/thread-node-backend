const db = require('../db');

const getNotese = (req, res) => {

    const selectQuery = 'SELECT customer.name,note.* FROM note inner join customer on note.customer_id=customer.id';
    db.query(selectQuery, (err, result) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        res.json(result);
    });
};

const getNotes = (req, res) => {
    const { id } = req.params;
    const selectQuery = 'SELECT * FROM note WHERE id = ?';
    db.query(selectQuery, [id], (err, result) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        res.json(result);
    });
};

const insertNotes = (req, res) => {
    const { customer_id, notes } = req.body;
    const insertQuery = 'INSERT INTO note(customer_id, notes ) VALUES(?,?)';
    db.query(insertQuery, [customer_id, notes], (err) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        res.send('notes inserted successfully');
    });
}

// GET request to retrieve notes
const getNotesOfSingleCustomer = async (req, res) => {
    const { customer_id } = req.params;
    const selectQuery1 = 'SELECT created_time as date FROM note WHERE customer_id = ? order by created_time asc';
    const dateList = await new Promise((resolve, reject) => {
        db.query(selectQuery1, [customer_id], (err, result) => {
            if (err) {
                console.error("Database query error:", err);
                res.status(500).send('Database query error');
                return;
            }

            try {
                const dates = result.map(item => item.date.toISOString().slice(0, 10)); // Ensure date is in YYYY-MM-DD format
                let uniqueDatesSet = new Set(dates);

                // Convert Set back to array (if needed)
                let uniqueDatesArray = [...uniqueDatesSet];
                resolve(uniqueDatesArray);
            } catch (error) {
                console.error("Error processing date:", error);
                res.status(500).send('Error processing date');
            }
        });
    })

    let notesList = {}
    for (let i = 0; i < dateList.length; i++) {
        const singleDate = dateList[i]
        const selectQuery = ` SELECT * FROM note WHERE customer_id = ? AND created_time LIKE "%${singleDate}%" order by created_time asc`;
        const gettedNotes=await new Promise((resolve,reject)=>{
            db.query(selectQuery, [customer_id], (err, result) => {
                if (err) {
                    res.status(500).send('Database query error');
                    return;
                }
                resolve(result)
            });
        })
        notesList[singleDate]=gettedNotes
    }
    res.send(notesList)
};



// PUT request to update notes
const updateNotes = (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;
    const updateQuery = 'UPDATE note SET notes = ? WHERE id = ?';
    db.query(updateQuery, [notes, id], (err) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        res.send('Notes updated successfully');
    });
};

// DELETE request to delete notes
const deleteNotes = (req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM note WHERE id = ?';
    db.query(deleteQuery, [id], (err) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        res.send('Notes deleted successfully');
    });
};

module.exports = { insertNotes, getNotes, getNotesOfSingleCustomer, updateNotes, deleteNotes, getNotese };