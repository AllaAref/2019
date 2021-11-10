import React from 'react';
import './LotList.scss';
import Lot from '../Lot/Lot';

class LotList extends React.Component {

    render() {
        return (
            <div className="main">
                <div className="container">
                    <div className="row">
                        {this.props.lots.map(lot => {
                            return <Lot 
                                title={lot.title}
                                key={lot.id}
                                id={lot.id}
                                description={lot.description}
                                price={lot.price}
                                image={lot.image}
                                currentBid={lot.current_bid}
                            />
                        })}  
                    </div>
                </div>
            </div>
        )
    }
}

export default LotList;