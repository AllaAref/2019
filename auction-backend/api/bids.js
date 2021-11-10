const express = require('express');
const bidsRouter = express.Router({mergeParams: true});
const util = require('./util');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

bidsRouter.get('/', (req, res, next) => {
    if(req.params.lotId) {
        db.all('SELECT Bid.id, lot_id, time, amount, name FROM Bid ' +
        'INNER JOIN User ON Bid.user_id=User.id ' +
        'WHERE lot_id=$id', {$id: req.params.lotId}, (error, bids) => {
            if(error) {
                next(error);
            } else {
                res.status(200).json({bids: bids});
            }
        });
    } else {
        const userId = util.getUserId;
        db.all('SELECT * FROM Bid INNER JOIN Lot ON Lot.id=Bid.lot_id WHERE user_id=$id', {$id: userId}, (error, bids) => {
            if(error) {
                next(error);
            } else {
                res.status(200).json({bids: bids});
            }
        });
    } 
});

bidsRouter.post('/', (req, res, next) => {
    const lot_id = req.params.lotId, time = Date.now(),
            user_id = 1, amount = req.body.amount;
    const sql = 'INSERT INTO Bid (lot_id, time, user_id, amount) ' +
                'VALUES($lot_id, $time, $user_id, $amount)';
    const values = {$lot_id: lot_id,
                    $time: time,
                    $user_id: user_id,
                    $amount: amount};
    db.run(sql, values, function(error) {
        if(error) {
            next(error);
        } else {
            db.get('SELECT * FROM Bid WHERE id=$id', {$id: this.lastID}, (error, bid) => {
                if(error) {
                    next(error);
                } else {
                    const bid_id = this.lastID;
                    const sql_lot = 'UPDATE Lot SET current_bid=$current_bid ' +
                                    ' WHERE id=$id';
                    const values_lot = {$id: lot_id,
                                        $current_bid: bid_id
                    };
                    db.run(sql_lot, values_lot, function(error) {
                        if(error) {
                            next(error);
                        } else {
                            db.get('SELECT * FROM Lot WHERE id=$id', {$id: lot_id}, (error, row) => {
                                if(error) {
                                    next(error);
                                } else {
                                    res.status(200).json({lot: row});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = bidsRouter;
