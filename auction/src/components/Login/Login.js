import React from 'react';
import PropTypes from 'prop-types';
import styles from './Login.module.scss';
import {Link} from 'react-router-dom';
import ClipboardIcon from '../../images/clipboardIcon.png';
import checkedSuccess from '../../images/checkedSuccess.png';
import useCopyToClipboard from '../../util/useCopyToClipboard';

function CopyButton({ textToCopy }) {
  // isCopied is reset after 3 second timeout
  const [isCopied, handleCopy] = useCopyToClipboard(3000);

  return (
    <button onClick={() => handleCopy(textToCopy)}>
      {isCopied ? <img src={checkedSuccess} /> : <img src={ClipboardIcon} />}
    </button>
  );
}

class Login extends React.Component {
  constructor() {
    super();
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(e) {
    e.preventDefault();
    let formData = new FormData(e.target);
    let data = {};
    for(var [key, value] of formData.entries()) {
      data[key] = value;
    }
    this.props.onLogin(data, this.props.history);
  }

  render() {
    return (
      <div className={styles.Login} data-testid="Login">
        <div className="left-text">
            <div>For demo purpose use:</div>
            <div>login: user_demo@gmail.com
              <CopyButton textToCopy="user_demo@gmail.com" />
            </div>
            <div>password: user_demo123456
              <CopyButton textToCopy="user_demo123456" />
            </div>
        </div>
        <form onSubmit={this.handleLogin} >
        <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputEmail4">Email</label>
              <input name="email" type="email" className="form-control" id="inputEmail4" placeholder="Email" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputPassword4">Password</label>
              <input name="password" type="password" className="form-control" id="inputPassword4" placeholder="Password" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="gridCheck" />
              <label className="form-check-label" htmlFor="gridCheck" >
                Check me out
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <button className="btn btn-primary float-right">Log in</button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              If you are not registered yet  
              <Link to={{ pathname: `/registration`}} > Sign up</Link>
            </div>
          </div>
        </form>
      </div>
    );
  }
};

export default Login;