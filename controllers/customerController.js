const { response } = require('express');

const db = require('../db');

const getCustomerDetails = (req, res) => {
    const getQuery = 'SELECT customer.*, services.service_name,customer_services.date_of_purchase,customer_services.expiry_date,customer_services.purchase_value  FROM customer INNER JOIN customer_services ON customer.id = customer_services.customer_id INNER JOIN services ON customer_services.service_id = services.id ORDER BY customer.id ASC;';
    db.query(getQuery, (err, results) => {
        if (err) {
            res.status(401).send('Error fetching customers');
            return;
        }
        res.json(results);
    });
};

const customer =async (req, res) => {
    const getQuery = `SELECT distinct * FROM customer`

    const results = await new Promise((resolve, reject) => {
        db.query(getQuery, (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });

    const getQuery1 = `SELECT COUNT(*) as total_cutomers FROM customer`

    const results1 = await new Promise((resolve, reject) => {
        db.query(getQuery1, (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });

    res.send([results,results1])
};

const getUpdateCustomerServiceDetails = (req, res) => {
    const { customer_services_id } = req.params
    const getQuery = `SELECT * FROM customer_services inner join services on customer_services.service_id=services.id where customer_services.id=?`
    db.query(getQuery, [customer_services_id], (err, results) => {
        if (err) {
            res.status(401).send('Error fetching customers');
            return;
        }
        res.json(results);
    });
};

const getCustomerDetail = (req, res) => {
    const { id, service_name } = req.params
    const getQuery = 'SELECT customer.*, services.service_name,customer_services.date_of_purchase,customer_services.expiry_date,customer_services.purchase_value   FROM customer INNER JOIN customer_services ON customer.id = customer_services.customer_id INNER JOIN services ON customer_services.service_id = services.id  where customer.id=? and services.service_name like ?';
    db.query(getQuery, [id, service_name], (err, results) => {
        if (err) {
            res.status(401).send('Error fetching customers');
            return;
        }
        res.json(results);
    });
};

const getCustomerInformation = (req, res) => {
    const { id } = req.params
    const getQuery = `SELECT * FROM customer WHERE id= ${id}`
    db.query(getQuery, (err, results) => {
        if (err) {
            res.status(401).send('Error fetching customers');
            return;
        }
        res.json(results);
    });
}




const getServicesListOwnedbyCustomer = async (req, res) => {
    const getQuery1 = 'SELECT DISTINCT  service_name FROM services';

    try {
        // Fetch distinct services
        const results = await new Promise((resolve, reject) => {
            db.query(getQuery1, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });


        const serviceList = results.map(item => item.service_name);

        // Fetch customers for each service
        let customers = {};
        for (let i = 0; i < serviceList.length; i++) {
            const service = serviceList[i];
            const getQuery2 = 'SELECT customer.*,customer_services.date_of_purchase,customer_services.expiry_date,customer_services.purchase_value,services.service_name  FROM customer INNER JOIN customer_services ON customer.id = customer_services.customer_id INNER JOIN services ON customer_services.service_id = services.id where services.service_name like ? ORDER BY customer.id ASC;';
            const customersForService = await new Promise((resolve, reject) => {
                db.query(getQuery2, [service], (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            });
            customers[service] = customersForService
        }

        res.send(customers);

    } catch (error) {
        res.status(401).send('Error fetching customers');
    }
}

const getSingleCustomerServices = (req, res) => {
    const { id } = req.params

    const getQuery = `SELECT *,customer_services.id as customer_services_id FROM 
        customer_services INNER JOIN services ON 
        customer_services.service_id=services.id 
    WHERE 
       customer_services.customer_id=${id} `
    db.query(getQuery, (err, results) => {
        if (err) {
            res.status(401).send('Error fetching customers');
            return;
        }
        res.json(results);
    });
}



const insertingCustomerDetails = async (req, res) => {
    const { service_name, date_of_purchase, purchase_value, expiry_date, price_with_gst, ...items } = req.body;


    const columns = Object.keys(items).join(', ');
    const placeholders = Object.keys(items).map(() => '?').join(', ');
    const values = Object.values(items);

    if (!columns.includes("company_name") && !columns.includes("phone_number")) {
        res.status(400).send('Missing required parameters');
        return;
    }


    //CHECKING IS THE USER IS ALREADY IN CUSTOMER TABLE
    const checkingQuery = 'select * from customer where phone_number=? or company_name like ? '
    const isUserAvail = await new Promise((resolve, reject) => {
        db.query(checkingQuery, [items.phone_number, items.company_name], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });

    if (isUserAvail.length === 0) {

        const getQuery = 'SELECT id FROM services WHERE service_name LIKE ?';
        try {
            const results = await new Promise((resolve, reject) => {
                db.query(getQuery, [service_name], (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            });
            const service_id = results[0].id;

            const insertQuery = `INSERT INTO customer (${columns}) VALUES (${placeholders})`;
            await new Promise((resolve, reject) => {
                db.query(insertQuery, values, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });

            const customerGetQuery = 'SELECT id FROM customer ORDER BY id DESC LIMIT 1';
            const customerResults = await new Promise((resolve, reject) => {
                db.query(customerGetQuery, (err, results) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(results);
                });
            });
            const customer_id = customerResults[0].id;

            const inserting = 'INSERT INTO customer_services (customer_id, service_id,date_of_purchase,expiry_date,purchase_value) VALUES (?, ?,?,?,?)';
            await new Promise((resolve, reject) => {
                db.query(inserting, [customer_id, service_id, date_of_purchase, expiry_date, purchase_value], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });

            res.send("Customer details inserted successfully");
        } catch (error) {
            res.status(401).send(error);
        }
    } else {
        const customer_id = isUserAvail[0].id
        const getQuery = 'SELECT id FROM services WHERE service_name LIKE ?';
        const results = await new Promise((resolve, reject) => {
            db.query(getQuery, [service_name], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
        const service_id = results[0].id;

        const getQuery6 = 'SELECT * FROM customer_services WHERE service_id = ? and customer_id = ?';
        const isAlreadyIn = await new Promise((resolve, reject) => {
            db.query(getQuery6, [service_id, customer_id], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });

        const inserting = 'INSERT INTO customer_services (customer_id, service_id,date_of_purchase,expiry_date,purchase_value,price_with_gst) VALUES (?, ?,?,?,?,?)';
        await new Promise((resolve, reject) => {
            db.query(inserting, [customer_id, service_id, date_of_purchase, expiry_date, purchase_value, price_with_gst], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });

        res.send("Customer details inserted successfully");
    }
};

const insertingCustomerInformation = async (req, res) => {
    const { ...items } = req.body;


    const columns = Object.keys(items).join(', ');
    const placeholders = Object.keys(items).map(() => '?').join(', ');
    const values = Object.values(items);

    if (!columns.includes("company_name") && !columns.includes("phone_number")) {
        res.status(400).send('Missing required parameters');
        return;
    }

    //CHECKING IS THE USER IS ALREADY IN CUSTOMER TABLE
    const checkingQuery = 'select * from customer where phone_number=? or company_name like ? '
    const isUserAvail = await new Promise((resolve, reject) => {
        db.query(checkingQuery, [items.phone_number, items.company_name], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });

    if (isUserAvail.length === 0) {
        try {
            const insertQuery = `INSERT INTO customer (${columns}) VALUES (${placeholders})`;
            await new Promise((resolve, reject) => {
                db.query(insertQuery, values, (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
            res.send("Customer details inserted successfully");
        } catch (error) {
            res.status(401).send(error);
        }
    } else {
        res.status(401).send("Customer already exist")
    }
};

const updateCustomerInformation = (req, res) => {
    const { id } = req.params;
    const { ...items } = req.body;

    // Construct the columns with placeholders for the update statement
    const columns = Object.keys(items).map(key => `${key} = ?`).join(', ');
    const values = Object.values(items);

    // Construct the update query
    const updateQuery = `UPDATE customer SET ${columns} WHERE id = ?`;

    // Execute the query
    db.query(updateQuery, [...values, id], (err, results) => {
        if (err) {
            res.status(500).send('Error updating customer information');
            return;
        }
        res.json({ message: 'Customer information updated successfully', results });
    });
};




const deleteCustomerDetails = (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).send('Customer ID is required');
        return;
    }

    const deleteQuery = `DELETE FROM customer WHERE id = ?`;

    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send('Customer not found');
            return;
        }

        res.send('Customer details deleted successfully');
    });
};

const updateCustomerServiceList = async (req, res) => {
    const { id } = req.params
    const { service_name, date_of_purchase, purchase_value, expiry_date, price_with_gst } = req.body

    const getQuery = 'SELECT id FROM services WHERE service_name LIKE ?';

    const results = await new Promise((resolve, reject) => {
        db.query(getQuery, [service_name], (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(results);
        });
    });
    const service_id = results[0].id;

    const updateServiceQuery = 'UPDATE customer_services SET service_id = ?, date_of_purchase=? , expiry_date=?, purchase_value=? , price_with_gst=? WHERE id = ?';
    await new Promise((resolve, reject) => {
        db.query(updateServiceQuery, [service_id, date_of_purchase, expiry_date, purchase_value, price_with_gst, id], (err) => {
            if (err) {
                res.status(401).send('Error fetching customers');
                return;
            }
            res.json("Details updated Successfully");
        });
    });
}

const updateCustomerDetails = async (req, res) => {
    const { id } = req.params
    const customerId = id
    const { service_name, date_of_purchase, purchase_value, expiry_date, ...items } = req.body;

    const columns = Object.keys(items).map(column => `${column} = ?`).join(', ');
    const placeholders = Object.keys(items).map(() => '?').join(', ');
    const values = Object.values(items);

    const getQuery = 'SELECT id FROM services WHERE service_name LIKE ?';

    try {
        const results = await new Promise((resolve, reject) => {
            db.query(getQuery, [service_name], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
        const service_id = results[0].id;

        const updateQuery = `UPDATE customer SET ${columns} WHERE id = ?`;
        await new Promise((resolve, reject) => {
            db.query(updateQuery, [...values, customerId], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });


        const getServiceQuery = 'SELECT id FROM customer_services WHERE customer_id = ?';
        const existingServiceResults = await new Promise((resolve, reject) => {
            db.query(getServiceQuery, [customerId], (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });
        console.log(existingServiceResults)

        if (2 > existingServiceResults.length > 0) {
            const updateServiceQuery = 'UPDATE customer_services SET service_id = ?, date_of_purchase=? , expiry_date=?, purchase_value=? WHERE customer_id = ?';
            await new Promise((resolve, reject) => {
                db.query(updateServiceQuery, [service_id, date_of_purchase, expiry_date, customerId, purchase_value], (err) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve();
                });
            });
        }

        res.send("Customer details updated successfully");
    } catch (error) {
        res.status(500).send('Database query error');
    }
};

const deleteCustomerEachService = async (req, res) => {
    const { id } = req.params;


    const deleteQuery = `DELETE FROM customer_services WHERE id = ?`;

    db.query(deleteQuery, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        if (result.affectedRows === 0) {
            res.status(404).send('Customer not found');
            return;
        }

        res.send('Customer details deleted successfully');
    });
}




module.exports = {updateCustomerServiceList, updateCustomerInformation, deleteCustomerEachService, getUpdateCustomerServiceDetails, getSingleCustomerServices, getCustomerDetails, getCustomerDetail, updateCustomerDetails, deleteCustomerDetails, getServicesListOwnedbyCustomer, insertingCustomerInformation, insertingCustomerDetails, customer, getCustomerInformation };
