const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    let jwtToken;
    const authHeader = req.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
        res.status(401).send("Invalid JWT Token");
    } else {
        jwt.verify(jwtToken, "MY_SECRET_TOKEN", (error) => {
            if (error) {
                res.status(401).send("Invalid JWT Token");
            } else {
                next();
            }
        });
    }
};

module.exports = authenticateToken;
