const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db.sqlite');

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'", (error, table) => {
  if (error) {
    throw new Error(error);
  }

  if (table) {
    db.serialize(function() {
      let userId;
      db.run("INSERT INTO User (id, name, email) VALUES (1, 'John', 'john@gmail.com')");
      db.run("INSERT INTO User (id, name, email) VALUES (2, 'Jennifer', 'jen@gmail.com')", function(error) {
        if (error) {
          throw new Error(error);
        }
        userId = this.lastID;
      });
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Lot'", (error, table) => {
        if (error) {
          throw new Error(error);
        }

        if (table) {
          db.run(`INSERT INTO Lot (title, description, price, starting_price, seller_id, auction_id, image) VALUES ('Bag', 'very nice', 100, 30, ${userId}, 1, 'https://blog.teachlr.com/wp-content/uploads/2017/07/Blog02.jpg')`);
          db.run(`INSERT INTO Lot (title, description, price, starting_price, seller_id, auction_id, image) VALUES ('Picture', 'precious', 300, 100, ${userId}, 1, 'https://s31531.pcdn.co/wp-content/uploads/2013/12/34492525681_a5fbc61dc3_b-768x527.jpg')`);
        }
      });
    });
  }
});

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Auction'", (error, table) => {
  if (error) {
    throw new Error(error);
  }

  if (table) {
    db.serialize(function() {
      let auctionId;
      db.run("INSERT INTO Auction (start_date, end_date, title, created_by) VALUES (100, 200, 'School Auction', 1)");
      db.run("INSERT INTO Auction (start_date, end_date, title, created_by) VALUES (120, 220, 'Renaissance', 2)");
      db.run("INSERT INTO Auction (start_date, end_date, title, created_by) VALUES (140, 240, 'Church Charity', 1)", function(error) {
        if (error) {
          throw new Error(error);
        }
        auctionId = this.lastID;
      });
      db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Lot'", (error, table) => {
        if (error) {
          throw new Error(error);
        }

        if (table) {
          db.run(`INSERT INTO Lot (title, description, price, starting_price, seller_id, auction_id, image) VALUES ('Pot Pie', 'Ooey Gooey and pairs well with espresso', 40, 12, 1, ${auctionId}, 'https://s31531.pcdn.co/wp-content/uploads/2015/05/3666.moleskin007-1.jpg')`);
          db.run(`INSERT INTO Lot (title, description, price, starting_price, seller_id, auction_id, image) VALUES ('Carrot Cake', 'The classic', 45, 15, 1, ${auctionId}, 'https://s31531.pcdn.co/wp-content/uploads/2013/12/Mary_Cassatt_-_The_Map_-_Christies_Sale_2475_Lot_5-1024x749.jpg')`);
        }
      });
    });
  }
});

