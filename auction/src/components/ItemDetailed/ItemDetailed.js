import React, { useState, useEffect } from 'react';
import Bid from '../Bid/Bid';
import {useParams} from 'react-router-dom';

function ItemDetailed(props) {

  let { id } = useParams();
  
  const [item, setItem] = useState({});

  useEffect(() => {
    if(props.lots.length) {
      let lot = props.lots.filter(lot => lot.id == id);
      if(lot.length) {
        setItem(lot[0]);
        props.getBidsForLot(lot[0].auction_id, id);
      }
      else {
        setItem({});
      }
    }
    else {
      setItem({});
    }
  }, [props.lots]);

  function onBid(id, amount) {
    props.onBid(16, id, amount);
  }
  
  return (
    <div className="container" data-testid="ItemDetailed">
      { !item.title ? 
        <h1>Lot not found</h1> :
        <div className="row">
        <div className="col-sm-6 col-lg-8">
          <div className="card mt-4">
            <img className="card-img-top img-fluid card-img-padding-margin"
              src={item.image} alt={item.title}
            />
            <div className="card-body">
              <h4 className="card-title">{item.title}</h4>
              <h5>${item.price}</h5>
              <p className="card-text">{item.description}</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-4">
          <Bid
            onBid={onBid}
            lotId={id}
            currentBid={item.current_bid || 0}
            lotPrice={item.price}
            startingPrice={item.starting_price}
            bids={props.bids}
          />
        </div>
      </div>
      } 
    </div>
  )
};

export default ItemDetailed;
