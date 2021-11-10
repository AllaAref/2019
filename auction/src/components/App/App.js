/* eslint-disable valid-jsdoc */
import React from 'react';
import './App.scss';
import Home from '../Home/Home';
import LotList from '../LotList/LotList';
import User from '../User/User';
import ItemDetailed from '../ItemDetailed/ItemDetailed';
import auctionDb from '../../util/Fetcher';
import Login from '../Login/Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Registration from '../Registration/Registration';
import Cookies from 'universal-cookie';

function PrivateRoute({ children, user, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        user.id ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}

class App extends React.Component {
  /**
 * The state for the page of an auction for the user.
 * @props component of React.
 */
  constructor(props) {
    super(props);
    this.state={
      lots: [],
      auction: '',
      user: {},
      bids: [],
      errorMessage: ''
    }
    this.getLotList = this.getLotList.bind(this);
    this.onLogin = this.onLogin.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.getMyBids = this.getMyBids.bind(this);
    this.getBidsForLot = this.getBidsForLot.bind(this);
    this.onUserBid = this.onUserBid.bind(this);
    this.tick = this.tick.bind(this);
  }

  tick(auctionId) {
    this.getLotList(auctionId)
    .then(() => {
      setTimeout(() => {
        this.tick(auctionId)
      }, 15000)
    });
  }

  getLotList(auctionId) {
    // TODO: Add user auction relation to backend and fix this
    return auctionDb.getLotList(16)
    .then(data => {
      this.setState ({
        lots: data
      })
    })
  }

  getMyBids() {
    auctionDb.getBidList()
    .then(data => {
      this.setState ({
        lots: data
      })
    })
  }

  getBidsForLot(auctionId, lotId) {
    auctionDb.getBidsByLot(auctionId, lotId)
    .then(bids => {
      this.setState ({
        bids: bids
      })
    })
  }

  onSignUp(userToAdd) {
    auctionDb.addNewUser(userToAdd)
    .then(user => {
        this.setState({
          user: user
        })
      })
    .then(() => {
      this.setState({errorMessage: ''})
    })
    .catch((err, data) => {
      this.setState({errorMessage: err.message})
    })
  }

  onLogin(userData, history) {
    auctionDb.checkUser(userData)
    .then(response => {
      if(response.success) {
        return response.token;
      } else {
        throw response.message;
      }
    })
    .then((token) => {
      const cookies = new Cookies();
      cookies.set('token', token, { path: '/' });
      return token;
    })
    .then((token) => {
      this.setState({
        errorMessage: ''
      });
      return token;
    })
    .then((token) => {
      return auctionDb.getUserByToken(token);
    })
    .then((user) => {
      this.setState({
        user: user
      },
      () => {
        history.replace("/");
        this.getLotList(16);
      })       
    })
    .catch(err => {
      let errorMessage = err.message || err;
      this.setState({errorMessage: err})
    })
  }

  onLogout() {
    auctionDb.logOutUser()
    .then(data => {
      if(data.success) {
        const cookies = new Cookies();
        cookies.set('token', '', { path: '/' });
        this.setState({
          user: {}
        })
      }
    })
    .catch(err => {
      let errorMessage = err.message || err;
      this.setState({errorMessage: err})
    })
  }

  onUserBid(auctionId, lotId, amount) {
    auctionDb.makeUserBid(auctionId, lotId, amount)
    .then(() => {
      this.getBidsForLot(auctionId, lotId);
      this.getLotList(auctionId);
    })
  }

  componentWillMount() {
    const cookies = new Cookies();
    const token = cookies.get('token');
    if(token) {
      auctionDb.getUserByToken(token)
      .then((user) => {
        if(user) {
          this.setState({
            user: user
          }, () => {this.tick(16)});
          ;
        }
      })
    }

    
  }
  /**
 * Renders the page of an auction for the user.
 * @return rendered page depending on path. 
 */
  render() {
    return (
      <Router>
        <div className="App">
          { this.state.errorMessage &&
            <div className="alert alert-danger" role="alert">
              { this.state.errorMessage } 
            </div> }
          <Switch>
            {this.state.user.id}
            <Route 
            render={(props) => (this.state.user.id ? 
              <Home
                auction={this.state.auction} 
                lots={this.state.lots}
                bids={this.state.bids} 
                onLogout={this.onLogout}
                onMyBids={this.getMyBids}
              /> : 
              <Login {...props} onLogin={this.onLogin}/>)}
            exact path={"/"}
            />
            <Route path="/login" 
              render={(props) => (
                <Login {...props} onLogin={this.onLogin} />
              )}
            />
            <Route path="/registration" 
              render={(props) => (
                <Registration {...props} onSubmit={this.onSignUp} />
              )}
            />
            <Route path="/lot/:id" user={this.state.user}
              render={(props) => (
                <ItemDetailed
                  lots={this.state.lots} 
                  onBid={this.onUserBid}
                  bids={this.state.bids}
                  getBidsForLot={this.getBidsForLot}
                />
              )}>
            </Route>
            <PrivateRoute path="/user/:id" user={this.state.user} >
              <User />
            </PrivateRoute>
            <PrivateRoute path="/bids" user={this.state.user} >
              <LotList />
            </PrivateRoute>
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
