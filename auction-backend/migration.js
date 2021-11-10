const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db.sqlite');

db.serialize(() => {
 db.run('CREATE TABLE IF NOT EXISTS `Lot` ('+
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
     'FOREIGN KEY(`buyer_id`) REFERENCES `User`(`id`))'
    );

    db.run('CREATE TABLE IF NOT EXISTS `User`('+
        '`id` INTEGER PRIMARY KEY,' +
        '`name` TEXT NOT NULL, ' +
        '`email` TEXT NOT NULL, ' +
        '`password` TEXT NOT NULL, ' +
        '`avatar` TEXT DEFAULT NULL,' +
        'is_deleted INTEGER NOT NULL DEFAULT 0)'
    );

    db.run('CREATE TABLE IF NOT EXISTS `Auction`(' +
        '`id` INTEGER PRIMARY KEY,' +
        '`start_date` INTEGER NOT NULL,' +
        '`end_date` INTEGER NOT NULL,' +
        '`title` TEXT NOT NULL,' +
        '`created_by` INTEGER NOT NULL,' +
        '`is_active` INTEGER NOT NULL DEFAULT 1,' +
        'FOREIGN KEY(`created_by`) REFERENCES `User`(`id`))'
    );

    db.run('CREATE TABLE IF NOT EXISTS `Bid` (' +
        '`id` INTEGER PRIMARY KEY, ' +
        '`lot_id` INTEGER NOT NULL, ' +
        '`time` INTEGER NOT NULL, ' +
        '`user_id` INTEGER NOT NULL, ' +
        '`amount` INTEGER NOT NULL,' +
        'FOREIGN KEY(`lot_id`) REFERENCES `Lot`(`id`),' +
        'FOREIGN KEY(`user_id`) REFERENCES `User`(`id`))'
    );

    db.run('CREATE TABLE IF NOT EXISTS `Token` (' +
        '`token` TEXT PRIMARY KEY, ' +
        '`user_id` INTEGER NOT NULL, ' +
        'FOREIGN KEY(`user_id`) REFERENCES `User`(`id`))'
    );
});