const express = require('express');
const lotsRouter = express.Router({mergeParams: true});
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');
const getUserId = require('./util');
const bidsRouter = require('./bids');

lotsRouter.param('lotId', (req, res, next, lotId) => {
    db.get('SELECT * FROM Lot WHERE id=$id AND auction_id=$auction_id', {$id: lotId, $auction_id:req.params.auctionId}, (error, row) => {
        if(error) {
            next(error);
        } else if(row) {
            req.lot = row;
            next();
        } else {
            res.sendStatus(404);
        }
    })
});

lotsRouter.get('/', (req, res, next) => {
    const sql = ('SELECT Lot.id AS id, title, image, description, starting_price, price, auction_id, amount FROM Lot ' +
    'LEFT JOIN Bid ON Lot.current_bid=Bid.id ' +  
    'WHERE Lot.auction_id=$auction_id');
    const values = {$auction_id: req.params.auctionId};
    db.all(sql, values, (error, lots) => {
        if(error) {
            next(error);
        } else {
            res.status(200).json({lots: lots});
        }
    })
});

lotsRouter.post('/', (req, res, next) => {
    const title = req.body.lot.title, image = req.body.lot.image,
            description = req.body.lot.description,
            price = req.body.lot.price, starting_price = 0.3 * price, 
            seller_id = req.body.lot.seller_id || getUserId, auction_id = req.params.auctionId;
    const sql = 'INSERT INTO Lot (title, image, description, starting_price, price, seller_id, auction_id)'+
                ' VALUES ($title, $image, $description, $starting_price, $price, $seller_id, $auction_id)';
    const values = {$title: title,
                    $image: image,
                    $description: description,
                    $starting_price: starting_price,
                    $price: price,
                    $seller_id: seller_id,
                    $auction_id: auction_id};
    if(!title || !image || !description || !price || !seller_id || ! auction_id) {
        res.sendStatus(400);
    }
    
    db.run(sql, values, function(error) {
        if(error) {
            next(error);
        } else {
            db.get(`SELECT * FROM Lot WHERE id=$id`, {$id: this.lastID}, (error, lot) => {
                if(error) {
                    next(error);
                } else {
                    res.status(201).json({lot: lot});
                }
            });
        }
    });
});

lotsRouter.get('/:lotId', (req, res, next) => {
    res.status(200).json({lot: req.lot});
})

lotsRouter.put('/:lotId', (req, res, next) => {
    const title = req.body.lot.title, image = req.body.lot.image,
            description = req.body.lot.description,
            starting_price = req.body.lot.starting_price, price = req.body.lot.price,
            seller_id = req.body.lot.seller_id || getUserId, auction_id = req.params.auctionId;
    if(!title || !image || !description || !price || !seller_id || ! auction_id) {
        res.sendStatus(400);
    }
    const sql = 'UPDATE Lot SET title=$title, image=$image, description=$description, ' +
                'starting_price=$starting_price, price=$price, seller_id=$seller_id, auction_id=$auction_id'+
                ' WHERE id=$id';
    const values = {$id: req.params.lotId,
                    $title: title,
                    $image: image,
                    $description: description,
                    $starting_price: starting_price,
                    $price: price,
                    $seller_id: seller_id,
                    $auction_id: auction_id};
    db.run(sql, values, function(error) {
        if(error) {
            next(error);
        } else {
            db.get('SELECT * FROM Lot WHERE id=$id', {$id: req.params.lotId}, (error, row) => {
                if(error) {
                    next(error);
                } else {
                    res.status(200).json({lot: row});
                }
            });
        }
    });
});

lotsRouter.delete('/:lotId', (req, res, next) => {
    const sql = 'DELETE FROM Lot WHERE id=$id';
    const values = {$id: req.params.lotId};
    db.run(sql, values, (error) => {
        if(error) {
            next(error);
        } else {
            res.sendStatus(204);
        }
    });
});

lotsRouter.use('/:lotId/bids', bidsRouter);

module.exports = lotsRouter;