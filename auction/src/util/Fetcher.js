const auctionDb = {
    getLotList(auctionId) {
        const endpoint = 'http://auction.openre.org/api/auctions/'+auctionId+'/lots';
        return fetch(endpoint, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            return data.lots.map(lot => {
                return {
                    id: lot.id,
                    title: lot.title,
                    price: lot.price,
                    starting_price: lot.starting_price,
                    description: lot.description,
                    image: lot.image,
                    current_bid: lot.amount,
                    user_name: lot.name,
                    auction_id: lot.auction_id
                }
            })
        })
    },

    getBidList() {
        const endpoint = 'http://auction.openre.org/api/bids';
        return fetch(endpoint, {
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            return data.bids.map(bid => {
                return {
                    lotId: bid.lot_id,
                    amount: bid.amount,
                    image: bid.image,
                    title: bid.title
                }
            })
        })
    },

    addNewUser(user) {
        const endpoint = 'http://auction.openre.org/api/users/register';
        return fetch(endpoint, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({user: user}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(!response.ok) {
                return response.json()
                .then(error => {
                    if(error.error) {
                        throw new Error(error.error);
                    }
                    throw new Error(response.status+': '+response.statusText);
                })
                
            } else {
                return response.json();
            }
        })
        .then(data => {
            return data.user;
        })
    },

    checkUser(userData) {
        const endpoint = 'http://auction.openre.org/api/users/login';
        return fetch (endpoint, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({user: userData}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(!response.ok) {
                throw "Invalid username or password";
            } else {
                return response.json();
            }
        })
    },

    getUserByToken(token) {
        const endpoint = 'http://auction.openre.org/api/users/token';
        return fetch(endpoint, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({token: token}),
            headers: {
                'Content-Type': 'application/json'  
            }
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.user;
        })
    },

    logOutUser() {
        const endpoint = 'http://auction.openre.org/api/users/logout';
        return fetch(endpoint, {
            method: 'DELETE',
            credentials: 'include',
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            return response.json();
        })
    },

    getBidsByLot(auctionId, lotId) {
        const endpoint = 'http://auction.openre.org/api/auctions/' + auctionId + '/lots/' + lotId + '/bids';
        return fetch(endpoint, {
            credentials: 'include'
        })
        .then(response => {
            return response.json();
        })
        .then(data => {
            return data.bids.map(bid => {
                return {
                    id: bid.id,
                    lotId: bid.lot_id,
                    time: bid.time,
                    user: bid.name,
                    amount: bid.amount
                }
            })
        })
    },

    makeUserBid(auctionId, lotId, amount) {
        const endpoint = 'http://auction.openre.org/api/auctions/' + auctionId + '/lots/' + lotId + '/bids';
        return fetch(endpoint, {
            method: 'POST',
            credentials: 'include',
            body: JSON.stringify({
                amount: amount
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if(!response.ok) {
                throw "Something went wrong";
            } else {
                return response.json();
            }
        })
    }
};

export default auctionDb;