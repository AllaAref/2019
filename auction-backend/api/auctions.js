const express = require('express');
const auctionsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');
const getUserId = require('./util');
const lotsRouter = require('./lots');

auctionsRouter.param('auctionId', (req, res, next, auctionId) => {
    const sql = 'SELECT * FROM Auction WHERE Auction.id=$id';
    const values = {$id: auctionId};
    db.get(sql, values, (error, row) => {
        if(error) {
            next(error);
        } else if(row) {
            req.auction = row;
            next();
        } else {
            res.sendStatus(404);
        }
    })
});

auctionsRouter.get('/', (req, res, next) => {
    const userId = req.params.user;
    const sql = 'SELECT * FROM Auction';
    db.all(sql, (error, rows) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({auctions: rows, user: userId});
        }
    });
});

auctionsRouter.get('/:auctionId', (req, res, next) => {
    res.status(200).json({auction: req.auction});
});

auctionsRouter.post('/', (req, res, next) => {
    const start_date = req.body.auction.start_date, end_date=req.body.auction.end_date,
            title = req.body.auction.title, created_by = req.body.auction.created_by;
    const sql = 'INSERT INTO Auction (start_date, end_date, title, created_by)'+
                'VALUES ($start_date, $end_date, $title, $created_by)';
    const values = {$start_date: start_date,
                    $end_date: end_date,
                    $title: title,
                    $created_by: created_by};
    db.run(sql, values, function(error) {
        if(!start_date || !end_date || !title || !created_by) {
            res.sendStatus(400);
        } else {
            if(error) {
                next(error);
            } else {
                db.get(`SELECT * FROM Auction WHERE id=${this.lastID}`, (error, row) => {
                    
                    if(error) {
                        next(error);
                    } else {
                        res.status(201).json({auction: row});
                    }
                })
            }}
    });
});

auctionsRouter.put('/:auctionId', (req, res, next) => {
    const start_date = req.body.auction.start_date, end_date=req.body.auction.end_date,
            title = req.body.auction.title, created_by = req.body.auction.created_by;
    const sql = 'UPDATE Auction SET start_date=$start_date,' +
                'end_date=$end_date, title=$title, created_by=$created_by '+
                'WHERE id=$id';
    const values = {$start_date: start_date,
                    $end_date: end_date,
                    $title: title,
                    $created_by: created_by,
                    $id: req.params.auctionId};
    
    if(!start_date || !end_date || !title || !created_by) {
        res.sendStatus(400);
    }
    db.run(sql, values, function(error) {
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Auction WHERE id=${req.params.auctionId}`, (error, row) => {
                if(error) {
                    next(error);
                } else {
                    res.status(200).json({auction: row});
                }
            });
        }   
    });
});

auctionsRouter.delete('/:auctionId', (req, res, next) => {
    const sql = 'UPDATE Auction SET is_active=0 WHERE id=$id';
    const values = {$id: req.params.auctionId};
    db.run(sql, values, (error, row) => {
        if(error) {
            next(error);
        } else  {
            db.get(`SELECT * FROM Auction WHERE id=${req.params.auctionId}`, (error, row) => {
                if(error) {
                    next(error);
                } else {
                    res.status(200).json({auction: row});
                }
            });
        }
    });
});

auctionsRouter.use('/:auctionId/lots', lotsRouter);

module.exports = auctionsRouter;