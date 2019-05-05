import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firebaseConnect } from "react-redux-firebase";
//import Settings from "../settings/Settings";

class AppNavBar extends Component {
  state = {
    isAuthenticated: false
  };

  onLogoutClick = e => {
    e.preventDefault();

    // Handle logout
    const { firebase } = this.props;
    const { email, password } = this.props.auth;
    firebase
      .logout({
        email,
        password
      })
      .catch(err => alert("Something goes wrong..."));

    return { isAuthenticated: false };
  };

  static getDerivedStateFromProps(props, state) {
    const { auth } = props;

    if (auth.uid) {
      return { isAuthenticated: true };
    } else {
      return { isAuthenticated: false };
    }
  }

  render() {
    const { isAuthenticated } = this.state;
    const { auth } = this.props;
    const { allowRegistration } = this.props.settings;
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Client Panel
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarMain"
          >
            <span className="navbar-toggler icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarMain" />
          <ul className="d-flex navbar-nav mr-auto">
            {isAuthenticated ? (
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  Dashboard
                </Link>
              </li>
            ) : null}
          </ul>
          {isAuthenticated ? (
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <a href="#!" className="nav-link">
                  {auth.email}
                </a>{" "}
              </li>
              <li className="nav-item">
                <Link to="/settings" className="nav-link">
                  Settings
                </Link>
              </li>
              <li className="nav-item">
                <a href="#!" className="nav-link" onClick={this.onLogoutClick}>
                  Logout
                </a>{" "}
              </li>
            </ul>
          ) : null}

          {allowRegistration && !isAuthenticated ? (
            <ul className="nav navbar-nav">
              <li>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </ul>
          ) : null}
        </div>
      </nav>
    );
  }
}

AppNavBar.propTypes = {
  auth: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default compose(
  firebaseConnect(),
  connect((state, props) => ({
    auth: state.firebase.auth,
    settings: state.settings
  }))
)(AppNavBar);
