const db = require('../db');

const getServiceList = (req, res) => {
    const getQuery = 'SELECT * FROM services';
    db.query(getQuery, (err, results) => {
        if (err) {
            res.status(401).send('Error fetching services');
            return;
        }
        res.json(results);
    });
};

const getServiceById = (req, res) => {
    const { id } = req.params;
    const getQuery = 'SELECT * FROM services WHERE id = ?';
    db.query(getQuery, [id], (err, results) => {
        if (err) {
            res.status(500).send('Error fetching service');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Service not found');
            return;
        }
        res.json(results);
    });
};

const insertService = async (req, res) => {
    const { service_name } = req.body;
    const checkingQuery = `SELECT * FROM services WHERE service_name LIKE ? ;`

    const isAvail = await new Promise((resolve, reject) => {
        db.query(checkingQuery,[service_name], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });
    console.log(isAvail)
    if (isAvail.length > 0) {
        res.status(500).send("Service already exist")
    } else {
        const insertQuery = 'INSERT INTO services(service_name) VALUES(?)';
        db.query(insertQuery, [service_name], (err) => {
            if (err) {
                res.status(500).send('Database query error');
                return;
            }
            res.send('Service inserted successfully');
        });
    }


};

const updateService = (req, res) => {
    const { id } = req.params;
    const { service_name, price_value } = req.body;
    const updateQuery = 'UPDATE services SET service_name = ?, price_value = ? WHERE id = ?';
    db.query(updateQuery, [service_name, price_value, id], (err, result) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Service not found');
            return;
        }
        res.send('Service updated successfully');
    });
};

const deleteService = (req, res) => {
    const { id } = req.params;
    const deleteQuery = 'DELETE FROM services WHERE id = ?';
    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).send('Database query error');
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).send('Service not found');
            return;
        }
        res.send('Service deleted successfully');
    });
};

module.exports = { getServiceList, getServiceById, insertService, updateService, deleteService };
