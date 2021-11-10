const express = require('express');
const loginRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');
const bcrypt = require('bcrypt');
const uuid = require ('uuid');

loginRouter.post('/', (req, res, next) => {
    const email = req.body.user.email,
        password = req.body.user.password,
        sql = "SELECT * FROM User WHERE email=$email",
        values = {$email: email};
    db.get(sql, values, (err, user) => {
        if(err) {
            next(err);
        } else {
            bcrypt.compare(password, user.password, function(err, ok) {
                if (err){
                    throw "encode error";
                }
                if (ok) {
                    const token = uuid.v4();
                    const sqlInsertToken = 'INSERT INTO Token (token, user_id)'+
                                ' VALUES ($token, $user_id)';
                    const valuesInsertToken = {$token: token,
                                    $user_id: user.id};
                    if(!token || !user.id) {
                        res.sendStatus(400);
                    }
                    db.run(sqlInsertToken, valuesInsertToken, function(error) {
                        if(error) {
                            next(error);
                        } else {
                            return res.json({success: true, token: token});
                        }
                    });
                } else {
                    return res.status(403).json({success: false, message: 'passwords do not match'});
                }
            });
        }
    })
});

module.exports = loginRouter;