const db = require('../db');


const expires = async (req, res) => {

    const getQuery = `select customer.*, customer_services.date_of_purchase,customer_services.expiry_date,customer_services.purchase_value from customer inner join 
    customer_services on customer_services.customer_id=customer.id 
    inner join services on services.id=customer_services.service_id 
    where DAY(customer_services.expiry_date)= ? and MONTH(customer_services.expiry_date)=? and YEAR(customer_services.expiry_date)=?
    order by customer.id asc
    `
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const thisDay = await new Promise((resolve, reject) => {
        db.query(getQuery, [day, month, year], (err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });

    const getQuery1 = `select customer.*, customer_services.date_of_purchase,customer_services.expiry_date,customer_services.purchase_value from customer inner join 
    customer_services on customer_services.customer_id=customer.id 
    inner join services on services.id=customer_services.service_id 
    where  MONTH(customer_services.expiry_date)=? and YEAR(customer_services.expiry_date)=?
    order by customer.id asc
    `

    const thisMonth = await new Promise((resolve, reject) => {
        db.query(getQuery1, [month, year], (err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });


    const getQuery2 = `select customer.*, customer_services.date_of_purchase,customer_services.expiry_date,customer_services.purchase_value from customer inner join 
    customer_services on customer_services.customer_id=customer.id 
    inner join services on services.id=customer_services.service_id 
    where YEAR(customer_services.expiry_date)=?
    order by customer.id asc
    `

    const thisYear = await new Promise((resolve, reject) => {
        db.query(getQuery2, [year], (err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });
    const final = {
        today: thisDay,
        this_month: thisMonth,
        thi_year: thisYear
    }
    res.status(200).send(final)

}

const getExpiry = (req, res) => {
    const { start_date, end_date } = req.query
    const getQuery = `SELECT customer.name,customer.id, services.service_name,customer_services.date_of_purchase, customer_services.expiry_date FROM customer_services inner join customer on customer_services.customer_id= customer.id inner JOIN services ON customer_services.service_id=services.id
    WHERE customer_services.expiry_date BETWEEN ? AND ? order by customer_services.expiry_date asc;`
    db.query(getQuery,[start_date,end_date],(err,results)=>{
        if(err){
            res.status(400).send(err)
        }
        res.send(results)
    })

}
module.exports = { expires,getExpiry }