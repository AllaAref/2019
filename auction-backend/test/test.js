process.env.PORT = 8081;
process.env.TEST_DATABASE = './test/test.sqlite';

const expect = require('chai').expect;
const request = require('supertest');
const sqlite3 = require('sqlite3');

const app = require('../server.js');
const seed = require('./seed.js');

const prodDb = new sqlite3.Database('./db.sqlite');
const testDb = new sqlite3.Database(process.env.TEST_DATABASE);

describe('Auction Table', function() {
 
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Auction'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Auction table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have title, start_date, end_date, is_active and created_by columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Auction (title, start_date, end_date, created_by, is_active) VALUES ('Auction Title', 100, 150, 1, 1)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Auction WHERE Auction.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required title column', function(done) {
    prodDb.run("INSERT INTO Auction (start_date, end_date, created_by) VALUES (100, 150, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Auction WHERE Auction.id = ${this.lastID}`, () => {
          done(new Error('Auction without tile was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required start_date column', function(done) {
    prodDb.run("INSERT INTO Auction (title, end_date, created_by) VALUES ('Auction Title', 150, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Auction WHERE Auction.id = ${this.lastID}`, () => {
          done(new Error('Auction without start_date was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required end_date column', function(done) {
    prodDb.run("INSERT INTO Auction (title, start_date, created_by) VALUES ('Auction Title', 100, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Auction WHERE Auction.id = ${this.lastID}`, () => {
          done(new Error('Auction without end_date was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required created_by column', function(done) {
    prodDb.run("INSERT INTO Auction (title, start_date, end_date) VALUES ('Auction Title', 100, 150)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Auction WHERE Auction.id = ${this.lastID}`, () => {
          done(new Error('Auction without created_by was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('Lot', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Lot'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Lot table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have title, image, description, starting_price, price, seller_id and auction_id columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Lot (title, image, description, starting_price, price, seller_id, auction_id)" +
                "VALUES ('Lot1', 'image', 'Nice lot', 99, 299, 1, 1)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Lot WHERE Lot.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required image column', function(done) {
    prodDb.run("INSERT INTO Lot (title, description, starting_price, price, seller_id, auction_id)"+
                "VALUES ('Lot1', 'Nice lot', 99, 299, 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Lot WHERE Lot.id = ${this.lastID}`, () => {
          done(new Error('Lot without image  was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required description column', function(done) {
    prodDb.run("INSERT INTO Lot (title, image, starting_price, price, seller_id, auction_id)" +
                "VALUES ('Lot1', 'image', 99, 299, 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Lot WHERE Lot.id = ${this.lastID}`, () => {
          done(new Error('Lot without description was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required starting price column', function(done) {
    prodDb.run("INSERT INTO Lot (title, image, description, price, seller_id, auction_id)" +
                "VALUES ('Lot1', 'image', 'Nice lot', 299, 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Lot WHERE Lot.id = ${this.lastID}`, () => {
          done(new Error('Lot without starting price was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required price column', function(done) {
    prodDb.run("INSERT INTO Lot (title, image, description, starting_price, seller_id,auction_id)" +
                "VALUES ('Lot1', 'Nice lot', 2.5, 299, 1, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Lot WHERE Lot.id = ${this.lastID}`, () => {
          done(new Error('Lot without price was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required seller_id column', function(done) {
    prodDb.run("INSERT INTO Lot (title, image, description, starting_price, price, auction_id)" +
                "VALUES ('Lot1', 'image', 'Nice lot', 199, 299, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Lot WHERE Lot.id = ${this.lastID}`, () => {
          done(new Error('Lot without seller_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required auction_id column', function(done) {
    prodDb.run("INSERT INTO Lot (title, image, description, starting_price, price, seller_id)" +
                "VALUES ('Lot1', 'image', 'Nice lot', 199, 299, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Lot WHERE Lot.id = ${this.lastID}`, () => {
          done(new Error('Lot without auction_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('User Table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='User'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'User table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have id and name columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO User (name, email) VALUES ('Username1', 'george@gmail.com')", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        const lastRowId = this.lastID;
        prodDb.run(`DELETE FROM User WHERE User.id = ${lastRowId}`, (error) => {
          if(error) {
            done(new Error(error));
          } else {
            expect(lastRowId).to.exist;
            done();
          }
          
        });
      }
    });
  });

  it('should have a required name column', function(done) {
    prodDb.run("INSERT INTO User (name, email) VALUES (NULL, 'george@gmail.com')", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM User WHERE User.id = ${this.lastID}`, () => {
          done(new Error('User without Name was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required email column', function(done) {
    prodDb.run("INSERT INTO User (name, email) VALUES ('Trishe', NULL)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM User WHERE User.id = ${this.lastID}`, () => {
          done(new Error('User without email was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('Bid Table', function() {
  it('should exist', function(done) {
    prodDb.get("SELECT name FROM sqlite_master WHERE type='table' AND name='Bid'", (error, table) => {
      if (error || !table) {
        done(new Error(error || 'Bid table not found'));
      }
      if (table) {
        done();
      }
    });
  });

  it('should have id, lot_id, time, user_id, amount columns with appropriate data types', function(done) {
    prodDb.run("INSERT INTO Bid (lot_id, time, user_id, amount) VALUES (3, 100, 1, 100)", function(error) {
      if (error) {
        done(new Error(error));
      } else {
        prodDb.run(`DELETE FROM Bid WHERE Bid.id = ${this.lastID}`, () => {
          expect(this.lastID).to.exist;
          done();
        });
      }
    });
  });

  it('should have a required lot_id column', function(done) {
    prodDb.run("INSERT INTO Bid (time, user_id, amount) VALUES (100, 1, 120)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Bid WHERE Bid.id = ${this.lastID}`, () => {
          done(new Error('Bid without lot_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required time column', function(done) {
    prodDb.run("INSERT INTO Bid (lot_id, user_id, amount) VALUES (3, 1, 120)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Bid WHERE Bid.id = ${this.lastID}`, () => {
          done(new Error('Bid without time was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required user_id column', function(done) {
    prodDb.run("INSERT INTO Bid (lot_id, time, amount) VALUES (3, 100, 120)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Bid WHERE Bid.id = ${this.lastID}`, () => {
          done(new Error('Bid without user_id was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });

  it('should have a required amount column', function(done) {
    prodDb.run("INSERT INTO Bid (lot_id, time, user_id) VALUES (3, 100, 1)", function(error) {
      if (error && error.toString().includes('NOT NULL constraint failed')) {
        done();
      } else if (!error) {
        prodDb.run(`DELETE FROM Bid WHERE Bid.id = ${this.lastID}`, () => {
          done(new Error('Bid without , amount was created.'));
        });
      } else {
        done(new Error(error));
      }
    });
  });
});

describe('GET /api/auctions', function() {
  before(function(done) {
    seed.seedAuctionDatabase(done);
  });

  it('should return all active auctions', function() {
    return request(app)
        .get('/api/auctions')
        .then(function(response) {
          const auctions = response.body.auctions;
          expect(auctions.length).to.equal(3);
          expect(auctions.find(auction => auction.id === 1)).to.exist;
          expect(auctions.find(auction => auction.id === 2)).to.exist;
          expect(auctions.find(auction => auction.id === 3)).to.exist;
          expect(auctions.find(auction => auction.id === 4)).to.not.exist;
        });
  });

  it('should return a status code of 200', function() {
    return request(app)
        .get('/api/auctions')
        .expect(200);
  });
});

describe('GET /api/auctions/:auctionId', function() {
  before(function(done) {
    seed.seedAuctionDatabase(done);
  });

  it('should return the auction with the given ID', function() {
    return request(app)
        .get('/api/auctions/2')
        .then(function(response) {
          const auction = response.body.auction;
          expect(auction.id).to.equal(2);
          expect(auction.start_date).to.equal(100);
          expect(auction.end_date).to.equal(150);
          expect(auction.title).to.equal('Auction 2');
          expect(auction.created_by).to.equal(2);
        });
  });

  it('should return a 200 status code for valid IDs', function() {
    return request(app)
        .get('/api/auctions/2')
        .expect(200);
  });

  it('should return a 404 status code for invalid IDs', function() {
    return request(app)
        .get('/api/auctions/999')
        .expect(404);
  });
});

describe('POST /api/auctions', function() {
  let newAuction;

  beforeEach(function(done) {
    seed.seedAuctionDatabase(done);

    newAuction = {
      start_date: 120,
      end_date: 162,
      title: 'New newAuction',
      created_by: 4
    };
  });

  it('should create a valid auction', function() {
    return request(app)
        .post('/api/auctions/')
        .send({auction: newAuction})
        .then(function() {
          testDb.all('SELECT * FROM Auction', function(error, result) {
            const auction = result.find(auction => auction.title === newAuction.title);
            expect(auction).to.exist;
            expect(auction.id).to.exist;
            expect(auction.start_date).to.exist;
            expect(auction.end_date).to.equal(newAuction.end_date);
            expect(auction.title).to.equal(newAuction.title);
            expect(auction.created_by).to.equal(newAuction.created_by);
          });
        });
  });

  it('should return a 201 status code after auction creation', function() {
    return request(app)
        .post('/api/auctions/')
        .send({auction: newAuction})
        .expect(201);
  });

  it('should return the newly-created auction after auction creation', function() {
    return request(app)
        .post('/api/auctions/')
        .send({auction: newAuction})
        .then(function(response) {
          const auction = response.body.auction;
          expect(auction).to.exist;
          expect(auction.id).to.exist;
          expect(auction.start_date).to.exist;
          expect(auction.end_date).to.equal(newAuction.end_date);
          expect(auction.title).to.equal(newAuction.title);
          expect(auction.created_by).to.equal(newAuction.created_by);
        });
  });

  it('should return a 400 status code for invalid auctions', function() {
    newAuction = {
      title: 'New newAuction',
      created_by: 2
    };

    return request(app)
        .post('/api/auctions/')
        .send({auction: newAuction})
        .expect(400);
  });
});


describe('PUT /api/auctions/:id', function() {
  let updatedAuction;

  beforeEach(function(done) {
    seed.seedAuctionDatabase(done);

    updatedAuction = {
      start_date: 120,
      end_date: 162,
      title: 'Updated Auction',
      created_by: 2
    };
  });

  it('should update the auction with the given ID', function(done) {
    request(app)
        .put('/api/auctions/1')
        .send({auction: updatedAuction})
        .then(function() {
          testDb.get('SELECT * FROM Auction WHERE Auction.id=1', function(error, auction) {
            if (error) {
              throw new Error(error);
            }
            expect(auction).to.exist;
            expect(auction.id).to.equal(1);
            expect(auction.start_date).to.equal(updatedAuction.start_date);
            expect(auction.end_date).to.equal(updatedAuction.end_date);
            expect(auction.title).to.equal(updatedAuction.title);
            expect(auction.created_by).to.equal(updatedAuction.created_by);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after auction update', function() {
    return request(app)
        .put('/api/auctions/1')
        .send({auction: updatedAuction})
        .expect(200);
  });

  it('should return the updated auction after auction update', function() {
    return request(app)
        .put('/api/auctions/1')
        .send({auction: updatedAuction})
        .then(function(response) {
          const auction = response.body.auction;
          expect(auction).to.exist;
            expect(auction.id).to.equal(1);
            expect(auction.start_date).to.equal(updatedAuction.start_date);
            expect(auction.end_date).to.equal(updatedAuction.end_date);
            expect(auction.title).to.equal(updatedAuction.title);
            expect(auction.created_by).to.equal(updatedAuction.created_by);
        });
  });

  it('should return a 400 status code for invalid employee updates', function() {
    updatedAuction = {
      title: 'updatedAuction',
      created_by: 2
    };

    return request(app)
        .put('/api/auctions/1')
        .send({auction: updatedAuction})
        .expect(400);
  });
});

describe('DELETE /api/auctions/:id', function() {
  beforeEach(function(done) {
    seed.seedAuctionDatabase(done);
  });

  it('should set the auction with the given ID as not active', function(done) {
    request(app)
        .del('/api/auctions/1')
        .then(function() {
          testDb.get('SELECT * FROM auction WHERE auction.id = 1', function(error, auction) {
            if (error) {
              throw new Error(error);
            }
            expect(auction).to.exist;
            expect(auction.is_active).to.equal(0);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after auction delete', function() {
    return request(app)
        .del('/api/auctions/1')
        .expect(200);
  });

  it('should return the deleted auction after auction delete', function() {
    return request(app)
        .del('/api/auctions/1')
        .then(function(response) {
          const auction = response.body.auction;
          expect(auction.id).to.equal(1);
          expect(auction.is_active).to.equal(0);
        });
  });
});

describe('GET /api/auctions/:auctionId/lots', function() {
  before(function(done) {
    seed.seedAuctionDatabase();
    seed.seedLotsDatabase(done);
  });

  it('should return all lots of an existing auction', function() {
    return request(app)
        .get('/api/auctions/1/lots')
        .expect(200)
        .then(function(response) {
          const lots = response.body.lots;
          expect(lots.length).to.equal(1);
          expect(lots.find(lot => lot.id === 3)).to.exist;
        });
  });

  it('should return an empty array for existing auction with no lots', function() {
    return request(app)
        .get('/api/auctions/4/lots')
        .expect(200)
        .then(function(response) {
          const lots = response.body.lots;
          expect(lots.length).to.equal(0);
        });
  });

  it('should return a status code of 200 for valid auction', function() {
    return request(app)
        .get('/api/auctions/2/lots')
        .expect(200);
  });

  it('should return a status code of 404 for invalid auctions', function() {
    return request(app)
        .get('/api/auctions/999/lots')
        .expect(404);
      });
});

describe('POST /api/auctions/:auctionId/lots', function() {
  let newLot;

  beforeEach(function(done) {
    newLot = {
      title: 'Title 5',
      image: 'image 5',
      description: 'Fantastic',
      starting_price: 100,
      price: 300,
      seller_id: 2,
      auction_id: 3
    };

    seed.seedAuctionDatabase();
    seed.seedLotsDatabase(done);
  });

  it('should create a valid lot', function() {
    return request(app)
        .post('/api/auctions/3/lots')
        .send({lot: newLot})
        .then(function() {
          testDb.all('SELECT * FROM Lot', function(error, result) {
            const lot = result.find(lot => lot.title === newLot.title);
            expect(lot).to.exist;
            expect(lot.id).to.exist;
            expect(lot.title).to.equal(newLot.title);
            expect(lot.image).to.equal(newLot.image);
            expect(lot.description).to.equal(newLot.description);
            expect(lot.starting_price).to.equal(100);
            expect(lot.price).to.equal(300);
            expect(lot.seller_id).to.equal(2);
            expect(lot.auction_id).to.equal(3);
          });
        });
  });

  it('should return a 201 status code after lot creation', function() {
    return request(app)
        .post('/api/auctions/3/lots')
        .send({lot: newLot})
        .expect(201);
  });

  it('should return the newly-created lot after lot creation', function() {
    return request(app)
        .post('/api/auctions/3/lots')
        .send({lot: newLot})
        .then(function(response) {
          const lot = response.body.lot;
          expect(lot).to.exist;
          expect(lot.id).to.exist;
          expect(lot.title).to.equal(newLot.title);
          expect(lot.image).to.equal(newLot.image);
          expect(lot.description).to.equal(newLot.description);
          expect(lot.starting_price).to.equal(100);
          expect(lot.price).to.equal(300);
          expect(lot.seller_id).to.equal(2);
          expect(lot.auction_id).to.equal(3);
        });
  });

  it('should return a 400 status code for invalid lots', function() {
    newLot = {
      price: 35,
      description: '100'
    };

    return request(app)
        .post('/api/auctions/3/lots')
        .send({lot: newLot})
        .expect(400);
  });

  it('should return a 404 status code if an auction with the lot\'s auction ID doesn\'t exist', function() {
    return request(app)
        .post('/api/auctions/100/lots')
        .send({lot: newLot})
        .expect(404);
  });
});

describe('PUT /api/auctions/:auctionId/lots/:lotId', function() {
  let updatedlot;

  beforeEach(function(done) {
    updatedlot = {
      title: 'Title 5',
      image: 'image 5',
      description: 'Fantastic',
      starting_price: 100,
      price: 300,
      seller_id: 2,
      auction_id: 3
    };

    seed.seedAuctionDatabase();
    seed.seedLotsDatabase(done);
  });

  it('should update the lot with the given ID', function(done) {
    request(app)
        .put('/api/auctions/3/lots/2')
        .send({lot: updatedlot})
        .then(function() {
          testDb.get('SELECT * FROM Lot WHERE Lot.id = 2', function(error, lot) {
            if (error) {
              throw new Error(error);
            }
            expect(lot).to.exist;
            expect(lot.id).to.exist;
            expect(lot.title).to.equal(updatedlot.title);
            expect(lot.image).to.equal(updatedlot.image);
            expect(lot.description).to.equal(updatedlot.description);
            expect(lot.starting_price).to.equal(updatedlot.starting_price);
            expect(lot.price).to.equal(updatedlot.price);
            expect(lot.seller_id).to.equal(2);
            expect(lot.auction_id).to.equal(updatedlot.auction_id);
            done()
          });
        }).catch(done);
  });

  it('should return a 200 status code after lot update', function() {
    return request(app)
        .put('/api/auctions/1/lots/2')
        .send({lot: updatedlot})
        .expect(200);
  });

  it('should return the updated lot after lot update', function() {
    return request(app)
        .put('/api/auctions/3/lots/2')
        .send({lot: updatedlot})
        .then(function(response) {
          const lot = response.body.lot;
          expect(lot).to.exist;
          expect(lot.id).to.exist;
          expect(lot.title).to.equal(updatedlot.title);
          expect(lot.image).to.equal(updatedlot.image);
          expect(lot.description).to.equal(updatedlot.description);
          expect(lot.starting_price).to.equal(updatedlot.starting_price);
          expect(lot.price).to.equal(updatedlot.price);
          expect(lot.seller_id).to.equal(2);
          expect(lot.auction_id).to.equal(updatedlot.auction_id);
        });
  });

  it('should return a 404 status code for invalid lot IDs', function() {
    updatedlot = {
      image: '3.5',
      date: 100
    };

    return request(app)
        .put('/api/auctions/1/lots/999')
        .send({lot: updatedlot})
        .expect(404);
  });

  it('should return a 400 status code for invalid lot updates', function() {
    updatedlot = {
      image: '3.5',
      description: 100
    };

    return request(app)
        .put('/api/auctions/1/lots/2')
        .send({lot: updatedlot})
        .expect(400);
  });

  it('should return a 404 status code if an auction with the updated auction ID doesn\'t exist', function() {
    updatedlot = {
      hours: 20,
      image: '3.5',
      description: 100
    };

    return request(app)
        .put('/api/auctions/999/lots/1')
        .send({lot: updatedlot})
        .expect(404);
  });
});

describe('DELETE /api/auctions/:auctionId/lots/:lotId', function() {
  beforeEach(function(done) {
    seed.seedAuctionDatabase();
    seed.seedLotsDatabase(done);
  });

  it('should remove the lot with the specified ID from the database', function(done) {
    request(app)
        .del('/api/auctions/2/lots/1')
        .then(function() {
          testDb.get('SELECT * FROM lot WHERE lot.id = 1', function(error, lot) {
            if (error) {
              throw new Error(error);
            }
            expect(lot).not.to.exist;
            done();
          });
        }).catch(done);
  });

  it('should return a 204 status code after lot delete', function() {
    return request(app)
        .del('/api/auctions/2/lots/1')
        .expect(204);
  });

  it('should return a 404 status code for invalid lot IDs', function() {
    return request(app)
        .del('/api/auctions/2/lots/999')
        .expect(404);
  });
});

describe('GET /api/users', function() {
  before(function(done) {
    seed.seedUserDatabase(done);
  });

  it('should return all users', function() {
    return request(app)
        .get('/api/users')
        .expect(200)
        .then(function(response) {
          const users = response.body.users;
          expect(users.length).to.equal(3);
          expect(users.find(users => users.id === 1)).to.exist;
          expect(users.find(users => users.id === 2)).to.exist;
          expect(users.find(users => users.id === 3)).to.exist;
        });
  });

  it('should return a status code of 200', function() {
    return request(app)
        .get('/api/users')
        .expect(200);
  });
});

describe('GET /api/users/:id', function() {
  before(function(done) {
    seed.seedUserDatabase(done);
  });

  it('should return the users with the given ID', function() {
    return request(app)
        .get('/api/users/2')
        .then(function(response) {
          const user = response.body.user;
          expect(user.id).to.equal(2);
          expect(user.name).to.equal('Wendy');
          expect(user.email).to.equal('wendy@gmail.com');
          expect(user.avatar).to.equal('link2');
        });
  });

  it('should return a 200 status code for valid IDs', function() {
    return request(app)
        .get('/api/users/2')
        .expect(200);
  });

  it('should return a 404 status code for invalid IDs', function() {
    return request(app)
        .get('/api/users/999')
        .expect(404);
  });
});

describe('POST /api/users', function() {
  let newUser;

  beforeEach(function(done) {
    newUser = {
      name: 'New User',
      email: 'newuser@gmail.com',
      avatar: 'newlink'
    };

    seed.seedUserDatabase(done);
  });

  it('should create a valid user', function() {
    return request(app)
        .post('/api/users/')
        .send({user: newUser})
        .then(function() {
          testDb.all('SELECT * FROM User', function(error, result) {
            const user = result.find(user => user.name === newUser.name);
            expect(user).to.exist;
            expect(user.id).to.exist;
            expect(user.name).to.equal(newUser.name);
            expect(user.email).to.equal(newUser.email);
            expect(user.avatar).to.equal(newUser.avatar);
          });
        });
  });

  it('should return a 201 status code after user creation', function() {
    return request(app)
        .post('/api/users/')
        .send({user: newUser})
        .expect(201);
  });

  it('should return the newly-created user after user creation', function() {
    return request(app)
        .post('/api/users/')
        .send({user: newUser})
        .then(function(response) {
          const user = response.body.user;
          expect(user).to.exist;
          expect(user.id).to.exist;
          expect(user.title).to.equal(newUser.title);
        });
  });

  it('should return a 400 status code for invalid users', function() {
    return request(app)
        .post('/api/users/')
        .send({user: {}})
        .expect(400);
  });
});

describe('PUT /api/users/:id', function() {
  let updatedUser;

  beforeEach(function(done) {
    updatedUser = {
      name: 'Updated User',
      email: 'wendy1@gmail.com',
      avatar: 'updatedLink'
    };

    seed.seedUserDatabase(done);
  });

  it('should update the user with the given ID', function(done) {
    request(app)
        .put('/api/users/2')
        .send({user: updatedUser})
        .then(function() {
          testDb.get('SELECT * FROM user WHERE user.id = 2', function(error, user) {
            if (error) {
              throw new Error(error);
            }
            expect(user).to.exist;
            expect(user.id).to.equal(2);
            expect(user.name).to.equal(updatedUser.name);
            expect(user.email).to.equal(updatedUser.email);
            expect(user.avatar).to.equal(updatedUser.avatar);
            done();
          });
        }).catch(done);
  });

  it('should return a 200 status code after user update', function() {
    return request(app)
        .put('/api/users/2')
        .send({user: updatedUser})
        .expect(200);
  });

  it('should return the updated user after user update', function() {
    return request(app)
        .put('/api/users/2')
        .send({user: updatedUser})
        .then(function(response) {
          const user = response.body.user;
          expect(user).to.exist;
          expect(user.id).to.equal(2);
          expect(user.name).to.equal(updatedUser.name);
          expect(user.email).to.equal(updatedUser.email);
          expect(user.avatar).to.equal(updatedUser.avatar);
        });
  });

  it('should return a 400 status code for invalid user updates', function() {
    return request(app)
        .put('/api/users/1')
        .send({user: {}})
        .expect(400);
  });
});

describe('GET /api/auctions/:auctionId/lots/:lotId/bids', function() {
  before(function(done) {
    seed.seedBidDatabase(done);
  });

  it('should return all lot bids of an existing auction', function() {
    return request(app)
        .get('/api/auctions/3/lots/2/bids')
        .then(function(response) {
          const auctionBids = response.body.auctionBids;
          expect(auctionBids.length).to.equal(2);
          expect(auctionBids.find(auctionBid => auctionBid.id === 1)).to.exist;
          expect(auctionBids.find(auctionBid => auctionBid.id === 3)).to.exist;
        });
  });

  it('should return an empty array for existing lot with no lot bids', function() {
    return request(app)
        .get('/api/auctions/3/lots/4/bids')
        .then(function(response) {
          const lotBids = response.body.lotBids;
          expect(lotBids.length).to.equal(0);
        });
  });

  it('should return a status code of 200 for valid bids', function() {
    return request(app)
        .get('/api/auctions/3/lots/2/bids')
        .expect(200);
  });
});

describe('POST /api/auctions/:auctionId/lots/:lotId/bids', function() {
  let newBid;

  beforeEach(function(done) {
    newBid = {
      lot_id: 4,
      time:270,
      user_id: 1,
      amount: 399
    };
    seed.seedBidDatabase(done);
  });

  it('should create a valid bid', function() {
    return request(app)
      .post('/api/auctions/3/lots/4/bids')
      .send({bid: newBid})
      .then(function() {
        testDb.all('SELECT * FROM Bid', function(error, result) {
          const lotBid = result.find(lotBid => lotBid.name === newBid.name);
          expect(lotBid).to.exist;
          expect(lotBid.id).to.exist;
          expect(lotBid.lot_id).to.equal(newBid.lot_id);
          expect(lotBid.time).to.equal(newBid.time);
          expect(lotBid.user_id).to.equal(newBid.user_id);
          expect(lotBid.amount).to.equal(newBid.amount);
        });
      });
  });

  it('should return a 201 status code after bid creation', function() {
    return request(app)
        .post('/api/auctions/3/lots/4/bids')
        .send({bid: newBid})
        .expect(201);
  });

  it('should return the newly-created bid after its creation', function() {
    return request(app)
      .post('/api/auctions/3/lots/4/bids')
      .send({bid: newBid})
      .then(function(response) {
        const lotBid = response.body.lotBid;
        expect(lotBid).to.exist;
        expect(lotBid.id).to.exist;
        expect(lotBid.lot_id).to.equal(newBid.lot_id);
        expect(lotBid.time).to.equal(newBid.time);
        expect(lotBid.user_id).to.equal(newBid.user_id);
        expect(lotBid.amount).to.equal(newBid.amount);
      });
  });

  it('should return a 400 status code for invalid bids', function() {
    newBid = {
      lot_id: 4,
      time: 270,
      user_id: 1
    };

    return request(app)
      .post('/api/auctions/3/lots/4/bids')
      .send({bid: newBid})
      .expect(400);
  });
});