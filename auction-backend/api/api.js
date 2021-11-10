const express = require('express');
const apiRouter = express.Router();
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

const auctionsRouter = require('./auctions');
const userRouter = require('./users');
const bidsRouter = require('./bids');

apiRouter.use('/', (req, res, next) => {
    const token = req.universalCookies.get('token');
    const sql = 'SELECT User.* FROM Token INNER JOIN User ON Token.user_id = User.id WHERE Token.token=$token',
        values = {$token: token};
    if(token) {
        db.get(sql, values, (err, user) => {
            if(err) {
                next(err);
            } else if(user) {
                delete user['password'];
                req.params.user = user;
                next();
            } else {
                next();
            }
        })
        
    } else {
        next();
    }
});

apiRouter.use('/auctions', auctionsRouter);
apiRouter.use('/users', userRouter);
//Bids for current user:
apiRouter.use('/bids', bidsRouter);

module.exports = apiRouter;