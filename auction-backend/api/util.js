// Helper function to get current user to use in routers.
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './db.sqlite');

// Get userId using user session cookie.
const getUserId = 1; /*function() {
    db.get('SELECT * FROM User WHERE id=1', (error, row) => {
        if(error) {
            next(error);
        } else {
            const user = row;
            return user;
        }
    });
};*/

const isAuctionActive = function(auctionEndDate) {
    const timeIs = Date.now();
    if(timeIs > auctionEndDate) {
        return 0;
    } else {
        return 1;
    }
};

module.exports = {getUserId, isAuctionActive};