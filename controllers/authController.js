const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require('../db');

const registerUser = async (req, res) => {
    const { email_address, password, name, gender, phone_number, designation, is_admin } = req.body;
    const getQuery = `SELECT * FROM user WHERE email_address=?`;

    db.query(getQuery, [email_address], async (err, results) => {
        if (results.length !== 0) {
            res.status(401).send("Email already exists");
            return;
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = "INSERT INTO user(email_address, password, name, gender, phone_number, designation, is_admin) VALUES(?,?,?,?,?,?,?)";
            db.query(insertQuery, [email_address, hashedPassword, name, gender, phone_number, designation, is_admin], (err) => {
                if (err) {
                    res.status(500).send(err);
                    return;
                }
                res.status(201).json({ message: 'User details inserted successfully' });
            });
        }
    });
};

const loginUser = async (req, res) => {
    const { email_address, password } = req.body;
    const getQuery = `SELECT * FROM user WHERE email_address=?`;

    db.query(getQuery, [email_address], async (err, results) => {
        if (results.length === 0) {
            res.status(500).send("Invalid email");
            return;
        } else {
            const isPasswordMatched = await bcrypt.compare(password, results[0].password);
            if (isPasswordMatched) {
                const payload = { email_address };
                const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
                res.send({ jwtToken });
            } else {
                res.status(500).send("Invalid");
            }
        }
    });
};

module.exports = { registerUser, loginUser };
