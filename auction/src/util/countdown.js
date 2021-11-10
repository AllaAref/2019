function calculateTimeLeft() {
    const auctionEnds = new Date();
    auctionEnds.setHours(23,59,59,999);
    const difference = auctionEnds - +new Date();
    let timeLeft = {}

    if(difference) {
        timeLeft = {
            hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            mins: Math.floor((difference / (1000 * 60)) % 60),
            secs: Math.floor((difference / 1000) % 60)
        }
    }
    return timeLeft;
}

export default calculateTimeLeft;