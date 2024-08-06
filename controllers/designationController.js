const db = require('../db');

const getAllDesignations = (req, res) => {
    const getQuery = 'SELECT * FROM designation';
    db.query(getQuery, (err, results) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        res.send(results);
    });
};

const getDesignationById = (req, res) => {
    const { id } = req.params;
    const getQuery = 'SELECT * FROM designation WHERE id=?';
    db.query(getQuery, [id], (err, results) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        res.send(results);
    });
};

const insertDesignation = async (req, res) => {
    const { designation } = req.body;

    if (!designation) {
        res.status(400).send('Designation is required');
        return;
    }
    const checkingQuery = `SELECT * FROM designation where designation like ? `
    const isUserAvail = await new Promise((resolve, reject) => {
        db.query(checkingQuery, [designation], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });
    if (isUserAvail.length === 0) {
        const insertQuery = 'INSERT INTO designation(designation) VALUES(?)';
        db.query(insertQuery, [designation], (err) => {
            if (err) {
                res.status(500).send('Database query error');
                return;
            }
            res.send('Designation inserted successfully');
        });
    }
    else{
        res.status(401).send("Designation already Exisit")
    }
};

const updateDesignation = (req, res) => {
    const { id } = req.params;
    const { designation } = req.body;

    if (!designation) {
        res.status(400).send('Designation is required');
        return;
    }

    const updateQuery = 'UPDATE designation SET designation = ? WHERE id = ?';
    db.query(updateQuery, [designation, id], (err, result) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Designation not found');
            return;
        }
        res.send('Designation updated successfully');
    });
};

const deleteDesignation = (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).send('ID is required');
        return;
    }

    const deleteQuery = 'DELETE FROM designation WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Designation not found');
            return;
        }
        res.send('Designation deleted successfully');
    });
};

module.exports = { getAllDesignations, getDesignationById, insertDesignation, updateDesignation, deleteDesignation };
