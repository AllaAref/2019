const express = require('express');
const registerRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');
const bcrypt = require('bcrypt');
const saltRounds = 10;

registerRouter.post('/', (req, res, next) => {
    const name = req.body.user.name, email = req.body.user.email,
            avatar = req.body.user.avatar;
    let password = req.body.user.password;
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(password, salt, function(err, hash) {
            if(err) return next(err);
            password = hash;
            const sql = 'INSERT INTO User (name, email, password, avatar) VALUES($name, $email, $password, $avatar)';
            const values = {$name: name,
                            $email: email,
                            $password: password,
                            $avatar: avatar};
            if(!name || !email) {
                res.status(400).json({error: "Invalid username or email"});
            }
            db.run(sql, values, function(error) {
                if(error) {
                    next(error);
                } else {
                    db.get('SELECT id, name, email, avatar FROM User WHERE id=$id', {$id: this.lastID}, (error, user) => {
                        if(error) {
                            next(error);
                        } else {
                            res.status(201).json({user: user});
                        }
                    });
                }
            });
        });
    }); 
});

module.exports = registerRouter;