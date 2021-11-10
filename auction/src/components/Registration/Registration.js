import React from 'react';
import { Link } from 'react-router-dom';

class Registration extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const {
      name,
      email,
      password,
      confirmPassword
    } = this.state;
    this.setState({
      isSubmitting: true
    })
    let formData = new FormData(e.target);
    let data = {};
    for(var [key, value] of formData.entries()) {
      data[key] = value; 
    }
    this.props.onSubmit(data);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
      isSubmitting: false
    })
  }

  render() {
    return (
      <div className="container" data-testid="User">
        <div className="form-row">
            <div className="form-group col-md-6 left-text">
              For demo purpose use:<br></br>
              login: skdhfskh@gmail.com <br></br>
              password: 123
            </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input name="name" id="inputName" type="text" className="form-control" placeholder="Name"
                    required onChange={this.onChange} />
            </div>
          </div>  
          <div className="form-row">
            <div className="form-group col-md-6">
              <input name="email" type="email" className="form-control" id="inputEmail" placeholder="Email"
                    required onChange={this.onChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input name="password" type="password" className="form-control" id="inputPassword" placeholder="Password"
                    required onChange={this.onChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <input name="confirmPassword" type="confirmPassword" className="form-control" id="confirmPassword" placeholder="Confirm password"
                    required onChange={this.onChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-check">
              <input className="form-check-input" type="checkbox" id="gridCheck" 
                    onChange={this.onChange}/>
              <label className="form-check-label" htmlFor="gridCheck" >
                Check me out
              </label>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              <button className="btn btn-primary float-right" 
                      disabled={this.state.isSubmitting}>
                      {this.state.isSubmitting ? 'Submitting' : 'Sign in'}
              </button>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group col-md-6">
              If you are already registered   
              <Link to={{ pathname: `/login`}} > Log in</Link>
            </div>
          </div>
        </form>
      </div>
    )
  }
};

export default Registration;