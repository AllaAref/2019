const express = require('express');
const userRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');
const registerRouter = require('./register');
const loginRouter = require('./login');
const logoutRouter = require('./logout');

userRouter.param('userId', (req, res, next, userId) => {
    const sql = 'SELECT * FROM User WHERE id=$id';
    const values = {$id: userId};
    db.get(sql, values, (error, user) => {
        if(error) {
            next(error);
        } else if(user) {
            req.user = user;
            next();
        } else {
            res.sendStatus(404);
        }
    });
});

userRouter.get('/:userId', (req, res, next) => {
    res.status(200).json({user: req.user});
});

userRouter.post('/token', (req, res, next) => {
    const token = req.body.token;
    db.get('SELECT User.* FROM Token INNER JOIN User ON Token.user_id = User.id WHERE Token.token=$token', {$token: token}, (error, user) => {
        if(error) {
            next(error);
        } else if(user) {
            delete user['password'];
            res.status(200).json({user: user});
        } else {
            res.status(404).json({});
        }
    })
});

userRouter.put('/:userId', (req, res, next) => {
    const name = req.body.user.name,
            email = req.body.user.email,
            avatar = req.body.user.avatar;
    const sql = 'UPDATE User SET name=$name, email=$email, avatar=$avatar WHERE id=$id';
    const values = {$name: name,
                    $email: email,
                    $avatar: avatar,
                    $id:req.params.userId};
    if(!name || !email) {
        res.sendStatus(400);
    }
    db.run(sql, values, function(error) {
        if(error) {
            next(error);
        } else {
            db.get('SELECT * FROM User WHERE id=$id', {$id: req.params.userId}, (error, user) => {
                if(error) {
                    next(error);
                } else {
                    res.status(200).json({user: user});
                }
            });
        }
    });
});

userRouter.use('/login', loginRouter);
userRouter.use('/register', registerRouter);
userRouter.use('/logout', logoutRouter);

module.exports = userRouter;