import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";
import classnames from "classnames";

class ClientDetails extends Component {
  state = {
    showBalanceForm: false,
    balanceUpdateAmount: ""
  };

  onChange = e => this.setState({ [e.target.name]: e.target.value });

  // Update balance
  onSubmit = e => {
    e.preventDefault();
    const { client, firestore } = this.props;
    const { balanceUpdateAmount } = this.state;

    const updateClient = {
      balance: parseFloat(balanceUpdateAmount)
    };

    firestore.update({ collection: "clients", doc: client.id }, updateClient);
  };
  // Delete client
  onDelete = e => {
    e.preventDefault();
    const { client, firestore, history } = this.props;

    firestore
      .delete({ collection: "clients", doc: client.id })
      .then(() => history.push("/"));
  };

  render() {
    const { client } = this.props;
    const { showBalanceForm, balanceUpdateAmount } = this.state;
    const { disableBalanceOnEdit } = this.props.settings;

    // if display balance form
    let balanceForm = "";
    if (showBalanceForm) {
      balanceForm = (
        <form onSubmit={this.onSubmit}>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={balanceUpdateAmount}
              name="balanceUpdateAmount"
              placeholder="Add new balance"
              onChange={this.onChange}
              disabled={disableBalanceOnEdit}
            />
            <div className="input-group-append">
              <input
                type="submit"
                value="Update"
                className="btn btn-outline-dark"
              />
            </div>
          </div>
        </form>
      );
    } else {
      balanceForm = null;
    }

    if (client) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <Link to="/" className="btn btn-link">
                <i className="fas fa-arrow-circle-left" /> Back to dashboard
              </Link>
            </div>
            <div className="col-md-6">
              <div className="btn-group float-right">
                <Link to={`/client/edit/${client.id}`} className="btn btn-dark">
                  Edit
                </Link>
                <button onClick={this.onDelete} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div className="card">
            <h3 className="card-header">
              {client.firstName} {client.lastName}
            </h3>
            <div className="card-body">
              <div className="row">
                <div className="col-md-8 col-sm-6">
                  Client ID: <span className="text-secondary">{client.id}</span>
                </div>
                <h3 className="col-md-4 col-sm-6">
                  Balance:{" "}
                  <span
                    className={classnames({
                      "text-danger": client.balance > 0,
                      "text-success": client.balance === 0
                    })}
                  >
                    ${parseFloat(client.balance).toFixed(2)}
                  </span>
                  <a
                    href="#!"
                    onClick={() =>
                      this.setState({
                        showBalanceForm: !this.state.showBalanceForm
                      })
                    }
                  >
                    {" "}
                    <i
                      className="fas fa-pencil-alt"
                      style={{ color: "black", fontSize: "18px" }}
                    />
                  </a>
                  {balanceForm}
                </h3>
              </div>
              <hr />
              <ul className="list-group">
                <li className="list-group-item">
                  Contact Email: {client.email}
                </li>
                <li className="list-group-item">Phone: {client.phone}</li>
              </ul>
            </div>
          </div>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

ClientDetails.propTypes = {
  firestore: PropTypes.object.isRequired,
  settings: PropTypes.object.isRequired
};

export default compose(
  firestoreConnect(props => [
    {
      collection: "clients",
      storeAs: "client",
      doc: props.match.params.id
    }
  ]),
  connect(({ firestore: { ordered }, settings }, props) => ({
    client: ordered.client && ordered.client[0],
    settings
  }))
)(ClientDetails);
