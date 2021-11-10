import React, { useEffect, useState } from 'react';

function BidsInfo(props) {
    return (
      <div className="row">
        <div className="col-4 amount-border">${props.amount}</div>
        <div className="col-8">{props.user_name}</div>
      </div>
    )
}

function Bid(props) {
  const bids = props.bids;

  function handleBid(e) {
    e.preventDefault();
    props.onBid(props.lotId, e.target.value);
  }

  const [nextBid, setNextBid] = useState('');

  useEffect(() => {
    const bidStep = Math.round((props.lotPrice - props.startingPrice) / 10);
    if(props.currentBid) {
      setNextBid(props.currentBid + bidStep);
    } else {
      setNextBid(props.startingPrice);
    }
  }, [props.currentBid]);

  return (
    <div className="container" data-testid="Bid">
      <div className="block">
        <div className="elem">
            {bids.map(bid => {
              return <BidsInfo 
                key={bid.id}
                amount={bid.amount}
                user_name={bid.user}
              />
            })
            }
        </div>
        <div className="elem">
          <h5>Make a bid:</h5>
          <button className="BidButton" value={nextBid} onClick={handleBid} type="button">{nextBid}</button>
        </div>
      </div>
    </div>
  );
};

export default Bid;
