const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./test/test.sqlite');

function seedAuctionDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS Auction');
    db.run('CREATE TABLE IF NOT EXISTS `Auction`(' +
        '`id` INTEGER PRIMARY KEY,' +
        '`start_date` INTEGER NOT NULL,' +
        '`end_date` INTEGER NOT NULL,' +
        '`lot_id` INTEGER,' +
        '`title` TEXT NOT NULL,' +
        '`is_active` INTEGER NOT NULL DEFAULT 1,' +
        '`created_by` INTEGER NOT NULL,' +
        'FOREIGN KEY(`lot_id`) REFERENCES `Lot`(`id`),' +
        'FOREIGN KEY(`created_by`) REFERENCES `User`(`id`))'
    );
    db.run("INSERT INTO Auction (start_date, end_date, title, created_by)" +
                        "VALUES (100, 150, 'Auction 1', 1)");
    db.run("INSERT INTO Auction (start_date, end_date, title, created_by)" +
                        "VALUES (110, 190, 'Auction 2', 2)");
    db.run("INSERT INTO Auction (start_date, end_date, title, created_by)" +
                        "VALUES (120, 170, 'Auction 3', 3)");
    db.run("INSERT INTO Auction (start_date, end_date, title, created_by)" +
                        "VALUES (130, 150, 'Auction 4', 4)", done);
  });
}

function seedLotsDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS Lot');
    db.run('CREATE TABLE IF NOT EXISTS `Lot` ( ' +
            '`id` INTEGER PRIMARY KEY,' +
            '`title` TEXT NOT NULL,' +
            '`image` TEXT NOT NULL,' +
            '`description` TEXT NOT NULL,' +
            '`current_bid` INTEGER,' +
            '`starting_price` INTEGER NOT NULL,' +
            '`price` INTEGER NOT NULL,' +
            '`seller_id` INTEGER NOT NULL,' +
            '`buyer_id` INTEGER,' +
            '`auction_id` INTEGER NOT NULL,' +
            'FOREIGN KEY(`seller_id`) REFERENCES `User`(`id`),' +
            'FOREIGN KEY(`buyer_id`) REFERENCES `User`(`id`))');
    db.run("INSERT INTO Lot (title, image, description, starting_price, price, seller_id, auction_id)" +
            "VALUES ('Lot1', 'image1', 'Nice', 150, 610, 1, 2)");
    db.run("INSERT INTO Lot (title, image, description, starting_price, price, seller_id, auction_id)" +
            "VALUES ('Lot2', 'image2', 'Great', 100, 610, 2, 3)");
    db.run("INSERT INTO Lot (title, image, description, starting_price, price, seller_id, auction_id)" +
            "VALUES ('Lot2', 'image3', 'Good', 100, 610, 1, 1)");
    db.run("INSERT INTO Lot (title, image, description, starting_price, price, seller_id, auction_id)" +
            "VALUES ('Lot3', 'image4', 'Amazing', 120, 620, 3, 1)", done);
  });
}

function seedUserDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS User');
    db.run('CREATE TABLE IF NOT EXISTS `User` ( ' +
              '`id` INTEGER PRIMARY KEY, ' +
              '`name` TEXT NOT NULL, ' +
              '`email` TEXT NOT NULL, ' +
              '`avatar` TEXT' +
              'is_deleted INTEGER NOT NULL DEFAULT 0)');
    db.run("INSERT INTO User (name, email, avatar) VALUES ('Mary', 'mary@gmail.com', 'link1')");
    db.run("INSERT INTO User (name, email, avatar) VALUES ('Wendy', 'wendy@gmail.com', 'link2')");
    db.run("INSERT INTO User (name, email, avatar) VALUES ('Alex', 'alex@gmail.com', 'link3')", done);
  });
}

function seedBidDatabase(done) {
  db.serialize(function() {
    db.run('DROP TABLE IF EXISTS Bid');
    db.run('CREATE TABLE IF NOT EXISTS `Bid` ( ' +
            '`id` INTEGER PRIMARY KEY, ' +
            '`lot_id` INTEGER NOT NULL, ' +
            '`time` INTEGER NOT NULL, ' +
            '`user_id` INTEGER NOT NULL, ' +
            '`amount` INTEGER NOT NULL,' +
            'FOREIGN KEY(`lot_id`) REFERENCES `Lot`(`id`),' +
            'FOREIGN KEY(`user_id`) REFERENCES `User`(`id`))');
    db.run("INSERT INTO Bid (lot_id, time, user_id, amount) VALUES (2, 120, 1, 100)");
    db.run("INSERT INTO Bid (lot_id, time, user_id, amount) VALUES (1, 125, 3, 200)");
    db.run("INSERT INTO Bid (lot_id, time, user_id, amount) VALUES (2, 126, 2, 110)");
    db.run("INSERT INTO Bid (lot_id, time, user_id, amount) VALUES (3, 127, 2, 250)", done);
  });
}

module.exports = {
  seedAuctionDatabase: seedAuctionDatabase,
  seedLotsDatabase: seedLotsDatabase,
  seedUserDatabase: seedUserDatabase,
  seedBidDatabase: seedBidDatabase
};