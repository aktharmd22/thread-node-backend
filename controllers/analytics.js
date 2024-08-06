const { response } = require('express');
const db = require('../db');

const { format } = require('date-fns');

const basedOnSpecificDate= async (req,res)=>{
    const{day,month,year}=req.query
    const getQuery='SELECT sum(purchase_value) as total_amount FROM customer_services WHERE YEAR(date_of_purchase) = ? and MONTH(date_of_purchase)=? and DAY(date_of_purchase)=?;'
    const result = await new Promise((resolve, reject) => {
        db.query(getQuery,[year,month,day],(err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });
    res.status(200).send(result)
    return
}

const basedOnMonth= async (req,res)=>{
    const{month,year}=req.query
    const getQuery='SELECT sum(purchase_value) as total_amount FROM customer_services WHERE YEAR(date_of_purchase) = ? and MONTH(date_of_purchase)=? ;'
    const result = await new Promise((resolve, reject) => {
        db.query(getQuery,[year,month],(err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });
    res.status(200).send(result)
    return
}

const basedOnYear= async (req,res)=>{
    const{year}=req.query
    const getQuery='SELECT sum(purchase_value) as total_amount FROM customer_services WHERE YEAR(date_of_purchase) = ? ;'
    const result = await new Promise((resolve, reject) => {
        db.query(getQuery,[year],(err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });
    
    res.status(200).send(result)
    return
}

const overAll= async (req,res)=>{
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const getQuery='SELECT sum(purchase_value) as total_amount FROM customer_services  ;'
    const totalAmount = await new Promise((resolve, reject) => {
        db.query(getQuery,(err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });
    
    const getQuery1='SELECT sum(purchase_value) as total_amount FROM customer_services WHERE YEAR(date_of_purchase) = ? and MONTH(date_of_purchase)=? and DAY(date_of_purchase)=?;'
    const thisDate = await new Promise((resolve, reject) => {
        db.query(getQuery1,[year,month,day],(err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });

    const getQuery2='SELECT sum(purchase_value) as total_amount FROM customer_services WHERE YEAR(date_of_purchase) = ? and MONTH(date_of_purchase)=? ;'
    const thisMonth = await new Promise((resolve, reject) => {
        db.query(getQuery2,[year,month],(err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });
    
    const getQuery3='SELECT sum(purchase_value) as total_amount FROM customer_services WHERE YEAR(date_of_purchase) = ? ;'
    const thisYear = await new Promise((resolve, reject) => {
        db.query(getQuery3,[year],(err, results) => {
            if (err) {
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results);
        });
    });

    const final={
        total_amount:totalAmount[0].total_amount,
        this_day:thisDate[0].total_amount,
        this_month:thisMonth[0].total_amount,
        thisYear:thisYear[0].total_amount
    }

    res.status(200).send(final)
   
}

const servicesCount= async(req,res)=>{
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, '0');

    const serviceNamesQuery=` 
    SELECT 
        DISTINCT service_name
    FROM
        services`
    const serviceNames= await new Promise((resolve,reject)=>{
        db.query(serviceNamesQuery,(err,results)=>{
            if(err){
                res.status(401).send('Error fetching column names');
                return;
            }
            resolve(results)
        })
    })
    const values=serviceNames.map((each)=>Object.values(each)).flat()
    let outp={}
    
    for( item in values){
        const currentElement=values[item]
        const getQuery=`
        SELECT 
            count(customer_services.id) as total_count,sum(customer_services.purchase_value) as total_amount
        FROM 
            customer_services inner join services on services.id=customer_services.service_id 
        where 
            DAY(customer_services.date_of_purchase)= ? AND MONTH(customer_services.date_of_purchase)=? AND YEAR(customer_services.date_of_purchase)=? and services.service_name=?
        GROUP BY 
            customer_services.service_id;`

        const today = await new Promise((resolve, reject) => {
            db.query(getQuery,[day,month,year,currentElement],(err, results) => {
                if (err) {
                    res.status(401).send('Error fetching column names');
                    return;
                }
                resolve(results);
            });
        })

        const getQuery1=`
        SELECT 
            count(customer_services.id) as total_count,sum(customer_services.purchase_value) as total_amount
        FROM 
            customer_services inner join services on services.id=customer_services.service_id 
        where 
            MONTH(customer_services.date_of_purchase)=? AND YEAR(customer_services.date_of_purchase)=? and services.service_name=?
        GROUP BY 
            customer_services.service_id;`

        const thisMonth = await new Promise((resolve, reject) => {
            db.query(getQuery1,[month,year,currentElement],(err, results) => {
                if (err) {
                    res.status(401).send('Error fetching column names');
                    return;
                }
                resolve(results);
            });
        })

        const getQuery2=`
        SELECT 
            count(customer_services.id) as total_count,sum(customer_services.purchase_value) as total_amount
        FROM 
            customer_services inner join services on services.id=customer_services.service_id 
        where 
            YEAR(customer_services.date_of_purchase)=? and services.service_name=?
        GROUP BY 
            customer_services.service_id;`

        const thisYear = await new Promise((resolve, reject) => {
            db.query(getQuery2,[year,currentElement],(err, results) => {
                if (err) {
                    res.status(401).send('Error fetching column names');
                    return;
                }
                resolve(results);
            });
        })

        const final={
            today:today,
            this_month:thisMonth,
            this_year:thisYear
        }
        outp[currentElement]=final
    }

    
    

    res.status(200).send(outp)
    return
}

const thisMontRenewal=async(req,res)=>{
    const {specific}=req.query
    const date=new Date()
    const check= specific==="day"?true:false
    const getResult1=await new Promise((resolve,reject)=>{
        const getQuery=`SELECT count(*) as expiry FROM customer_services where ${check? `day(expiry_date)=${date.getDate()} and ` :""}   month(expiry_date)=? and year(expiry_date)=?;`
        db.query(getQuery,[(date.getMonth()+1),(date.getFullYear())],(err,result)=>{
            if(err){
                reject(err)
            }
            resolve(...result)
        })
    })
    
    const getResult2=await new Promise((resolve,reject)=>{
        const getQuery=`SELECT count(*) as renewal FROM renewal where ${check? `day(renewal_date)=${date.getDate()} and ` :""}  month(renewal_date)=? and year(renewal_date)=?;`
        db.query(getQuery,[(date.getMonth()+1),(date.getFullYear())],(err,result)=>{
            if(err){
                reject(err)
            }
            resolve(...result)
        })
    })
    const getResult3=await new Promise((resolve,reject)=>{
        const getQuery=`SELECT customer_services.customer_id,customer_services.expiry_date,services.service_name FROM customer_services inner join services on services.id=customer_services.service_id  where ${check? `day(customer_services.expiry_date)=${date.getDate()} and ` :""}   month(customer_services.expiry_date)=? and year(customer_services.expiry_date)=?;`
        db.query(getQuery,[(date.getMonth()+1),(date.getFullYear())],(err,result)=>{
            if(err){
                reject(err)
            }
            resolve(result)
        })
    })

    const getResult4=await new Promise((resolve,reject)=>{
        const getQuery=`SELECT renewal.customer_id,renewal.renewal_date,services.service_name FROM renewal inner join services on services.id=renewal.service_id  where ${check? `day(renewal_date)=${date.getDate()} and ` :""}   month(renewal.renewal_date)=? and year(renewal.renewal_date)=?;`
        db.query(getQuery,[(date.getMonth()+1),(date.getFullYear())],(err,result)=>{
            if(err){
                reject(err)
            }
            resolve(result)
        })
    })
    

    const final=[{
       ... getResult1,...getResult2
    },{
       expiry_list: getResult3,renewal_list:getResult4
    }
]
    res.send(final)
}
//SELECT service_id,COUNT(*) as total FROM `customer_services` GROUP by service_id;





module.exports={basedOnSpecificDate,basedOnMonth,basedOnYear,overAll, servicesCount,thisMontRenewal}