import React from 'react';
import './Lot.scss';
import { Link } from 'react-router-dom';

class Lot extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="col-md-3 col-sm-6 col-xs-12 mb-4">
            <div className="card h-100">
                <Link to={{ pathname: `/lot/${this.props.id}`}}>
                    <div className="image">
                        <img className="img-top-100 img-fluid lot-img"
                            src={this.props.image} alt={this.props.title}
                        />
                    </div>    
                </Link>
                <div className="card-body">
                    <h4 className="card-title">
                    <Link className="title-text-violet" to={{
                        pathname: `/lot/${this.props.id}`}}>{this.props.title}</Link>
                    </h4>
                    <h5>${this.props.price}</h5>
                    <p className="card-text">{this.props.description}</p>
                </div>
                <div className="card-footer">
                    Current bid: {this.props.currentBid}
                </div>
            </div>
            </div>
        )
    }
}

export default Lot;