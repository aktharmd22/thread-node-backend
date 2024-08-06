const db = require('../db');
const bcrypt = require("bcrypt");

const getAgentList = (req, res) => {
    const getQuery = 'SELECT * FROM user';
    db.query(getQuery, (err, results) => {
        if (err) {
            res.status(401).send('Error fetching users');
            return;
        }
        res.json(results);
    });
};

const getAgentById = (req, res) => {
    const { id } = req.params;
    const getQuery = 'SELECT * FROM user WHERE is_admin=0 AND id=?';
    db.query(getQuery, [id], (err, results) => {
        if (err) {
            res.status(401).send('Error fetching users');
            return;
        }
        res.json(results);
    });
};

const getAgentByEmail = (req, res) => {
    const { email_address } = req.params;
    const getQuery = 'SELECT * FROM user WHERE email_address = ?';
    
    db.query(getQuery, [email_address], (err, results) => {
        if (err) {
            res.status(401).send('Error fetching users');
            return;
        }
        res.json(results);
    });
};

const updateUserDetails = async (req, res) => {
    const { id } = req.params;
    const {password,...items} = req.body;

    if (!id) {
        res.status(400).send('User ID is required');
        return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)

    console.log(password)

    

    if (Object.keys(items).length === 0) {
        res.status(400).send('No data provided to update');
        return;
    }

    const setPart = Object.keys(items).map(key => `${key} = ?`).join(', ');
    const values = Object.values(items);
    console.log(values)
    console.log(setPart)

    const updateQuery = `UPDATE user SET ${setPart}, password= ?  WHERE id = ?`;
    console.log(updateQuery)

    db.query(updateQuery, [...values,hashedPassword, id], (err, result) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send('User not found');
            return;
        }

        res.send('User details updated successfully');
    });
};

const deleteAgentById = (req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM user WHERE is_admin=0 AND id=?';
    
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).send('Error deleting user');
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send('User not found or already deleted');
            return;
        }

        res.send('User deleted successfully');
    });
};



module.exports = { getAgentList, getAgentById, updateUserDetails, deleteAgentById, getAgentByEmail };
