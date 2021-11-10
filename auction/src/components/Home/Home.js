import React from 'react';
import Auction from '../Auction/Auction';
import LotList from '../LotList/LotList';

class Home extends React.Component {
    render() {
        return (
            <div>
                <div>
                    <Auction
                        auction={this.props.auction}
                        title={this.props.auction.title}
                        handleLogout={this.props.onLogout}
                        handleMyBids={this.props.onMyBids}
                    />
                </div>
                <div>
                    <LotList lots={this.props.lots} />
                </div>
            </div>
        );
    }
}

export default Home;