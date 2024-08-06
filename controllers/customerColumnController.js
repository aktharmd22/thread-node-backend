const db = require('../db');

const getCustomerColumnName =async (req, res) => {
    const tableName = "customer";
    const getQuery = `SELECT  COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}';`;
    
    const v = await new Promise((resolve, reject) => {
        db.query(getQuery, (err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });
    const values = v.map((each)=>Object.values(each));
    const k=[]
    values.forEach((each)=>k.push(...each))
    const final=[...k,"service_name"]
    res.json(v)  
};

const addColumns = (req, res) => {
    const { data } = req.body;

    data.forEach(({ column_name, column_type }) => {
        const updateQuery = `ALTER TABLE customer ADD COLUMN ${column_name} ${column_type}`;
        db.query(updateQuery, (err) => {
            if (err) {
                res.status(500).send('Error updating user details');
                return;
            }
        });
    });

    res.status(200).json( 'User Column names updated successfully' );
};

const updateColumnNames = (req, res) => {
    const { old_column_name, new_column_name, column_type } = req.body;

    if (!old_column_name || !new_column_name || !column_type) {
        res.status(400).send('Missing required parameters');
        return;
    }

    const renameQuery = `ALTER TABLE customer CHANGE COLUMN ?? ?? ${column_type}`;
    const renameValues = [old_column_name, new_column_name];

    db.query(renameQuery, renameValues, (err) => {
        if (err) {
            res.status(500).send('Error renaming column');
            return;
        }
        res.status(200).json('Column name and type updated successfully');
    });
};

const deleteColumn = (req, res) => {
    const { column_name } = req.body;

    if (!column_name) {
        res.status(400).send('Missing required parameter: column_name');
        return;
    }

    const deleteQuery = `ALTER TABLE customer DROP COLUMN ??`;
    const deleteValues = [column_name];

    db.query(deleteQuery, deleteValues, (err) => {
        if (err) {
            res.status(500).send('Error deleting column');
            return;
        }
        res.status(200).json('Column deleted successfully');
    });
};



module.exports={getCustomerColumnName,addColumns,updateColumnNames,deleteColumn}