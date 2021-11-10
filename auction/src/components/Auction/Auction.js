/* eslint-disable indent */
/* eslint-disable valid-jsdoc */
import React, {useState, useEffect} from 'react';
import './Auction.scss';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import calculateTimeLeft from '../../util/countdown';

function CountDown() {
    
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer=setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
  });

  let timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });
  return (
    <div>
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
}
  
/**
   * @class Auction renders the header of auction
   */
class Auction extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          show: false
      };
      this.handleSuccesfulAuth = this.handleSuccesfulAuth.bind(this);
  }

  handleSuccesfulAuth(data) {
      this.props.handleLogin(data);
      this.props.history.push("/auctions");
  }

  render() {
    return (
      <div className="main">
        <div className="container">
          <h1>Auction: Coins</h1>
          <div className="row">
              <div className="col-md-3 col-sm-6 col-xs-12 mb-4">
                  <DropdownButton id="dropdown-item-button"
                      variant="light"
                      title={ <i className="fas fa-bars"></i> }
                      onMouseEnter={(e) => this.setState({ show: true })}
                      onMouseLeave={(e) => this.setState({ show: false })}
                      show={this.state.show}
                      >
                      <Dropdown.Item as="button" onClick={this.props.handleMyBids}>My bids</Dropdown.Item>
                      <Dropdown.Item as="button" onClick={this.props.handleLogout}>Logout</Dropdown.Item>
                  </DropdownButton>
              </div>
              <div className="col-md-3 col-sm-6 col-xs-12 mb-4"></div>
              <div className="col-md-3 col-sm-6 col-xs-12 mb-4"></div>
              <div className="col-md-3 col-sm-6 col-xs-12 mb-4 timer">
                <CountDown key="countdown" />
              </div>
          </div>
          </div>
        </div>
      );
    }
}

export default Auction;