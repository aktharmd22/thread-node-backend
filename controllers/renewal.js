const db = require("../db")

const getRenewal = async (req, res) => {
    const { customer_id } = req.params;

    try {
        // First query
        let getResult1 = await new Promise((resolve, reject) => {
            const getQuery = `SELECT services.service_name, customer_services.customer_id,
                customer_services.id as customer_service_table_id, customer_services.service_id,
                customer_services.date_of_purchase, customer_services.expiry_date
                FROM services
                INNER JOIN customer_services ON customer_services.service_id = services.id
                WHERE customer_services.customer_id = ?;`;
            db.query(getQuery, customer_id, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(results);
            });
        });


        // Second query using Promise.all
        const getResult2 = await Promise.all(
            getResult1.map(each => {
                const { service_id, customer_service_table_id } = each;
                return new Promise((resolve, reject) => {
                    const getQuery = `SELECT * FROM renewal WHERE customer_id = ? AND service_id = ? AND customer_service_table_id = ? order by renewal_date desc`;
                    db.query(getQuery, [customer_id, service_id, customer_service_table_id], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(results);
                        }
                    });
                });
            })
        );

        let renewalMap = new Map();

        // Populate the map with result2 data
        getResult2.forEach(renewals => {
            renewals.forEach(renewal => {
                let tableId = renewal.customer_service_table_id;
                if (!renewalMap.has(tableId)) {
                    renewalMap.set(tableId, []);
                }
                renewalMap.get(tableId).push({
                    renewal_id: renewal.id,
                    renewal_date: renewal.renewal_date,
                    price: renewal.price
                });
            });
        });

        // Update result1 with renewal_table_list based on customer_service_table_id
        getResult1.forEach(item => {
            let tableId = item.customer_service_table_id;
            if (renewalMap.has(tableId)) {
                item.renewal_table_list = renewalMap.get(tableId);
            } else {
                item.renewal_table_list = []; // Ensure an empty array if no renewals found
            }
        });

        
        res.send(getResult1);

    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred");
    }
};


const insertRenewal = async (req, res) => {
    const { customer_id, renewal_date, price, expiry_date, service_id, customer_service_table_id } = req.body


    const insert1 = await new Promise((resolve, reject) => {
        const insertQuery = `INSERT INTO renewal(customer_id, renewal_date, price,service_id,customer_service_table_id)
        VALUES(?,?,?,?,?)`
        db.query(insertQuery, [customer_id, renewal_date, price, service_id, customer_service_table_id], (err, results) => {
            if (err) {
                reject(err)
                return
            }
            resolve(results)
        })
    })
    const insert2 = await new Promise((resolve, reject) => {
        const insertQuery = `update customer_services set expiry_date = ? where customer_id = ? and service_id=? and id= ?`
        db.query(insertQuery, [expiry_date, customer_id, service_id, customer_service_table_id], (err, results) => {
            if (err) {
                reject(err)
                return
            }
            resolve(results)
        })
    })
    res.send("inserted successfully")

}

module.exports = { insertRenewal, getRenewal }

// SELECT services.id as service_id,renewal.id as renewal_id,services.service_name,customer_services.date_of_purchase,customer_services.expiry_date,renewal.renewal_date,renewal.price from
// services inner join customer_services on services.id= customer_services.service_id
// inner join renewal on customer_services.customer_id = renewal.customer_id
// WHERE customer_services.customer_id=33 and customer_services.service_id=10

// SELECT services.id as service_id,renewal.id as renewal_id,services.service_name,customer_services.date_of_purchase,customer_services.expiry_date,renewal.renewal_date,renewal.price from
// services inner join customer_services on services.id= customer_services.service_id
// inner join renewal on customer_services.customer_id = renewal.customer_id
// WHERE customer_services.customer_id=33