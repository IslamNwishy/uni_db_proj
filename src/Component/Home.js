import React, { Component } from "react";
import { ClipLoader } from "react-spinners";

class SignIn extends Component {
  state = {
    SID: "",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    if (this.state.content !== "") {
      this.props.signIn(this.state);
      this.setState({
        SID: "",
      });
    }
  };

  logout = (e) => {
    e.preventDefault();
    this.props.logout();
  };
  render() {
    if (!this.props.signed) {
      return (
        <div>
          {!this.props.waiting ? (
            <div className="col-lg-3 col-sm-12 container mt-5 pt-5">
              <p className="text-center">
                Please enter your SID to be able to register courses and see
                reviews
              </p>

              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="SID">SID</label>
                  <input
                    placeholder="SID"
                    id="SID"
                    type="text"
                    className="form-control"
                    onChange={this.handleChange}
                    value={this.state.SID}
                  ></input>
                </div>

                <button type="submit" className="btn btn-dark">
                  Enter
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center container mt-5 pt-5">
              <ClipLoader
                size={150}
                color={"#123abc"}
                loading={this.state.waiting}
              />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="text-center mt-5">
          <h3>
            Welcome Back <strong>{this.props.name}</strong>
          </h3>
          <button onClick={this.logout} className="btn btn-danger mt-3">
            Log Out
          </button>
        </div>
      );
    }
  }
}

export default SignIn;
