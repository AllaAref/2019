const express = require ('express');
const logoutRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

logoutRouter.delete('/', (req, res, next) => {
    const token = req.universalCookies.get('token');
    if(!token) {
        res.json({success: true});
    }
    const sql = 'DELETE FROM Token WHERE token=$token';
    const values = {$token: token};
    db.run(sql, values, (err, response) => {
        if(err) {
            next(err);
        } else {
            return res.json({success: true});
        }
    })
})

module.exports = logoutRouter;