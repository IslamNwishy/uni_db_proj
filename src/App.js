import React, { Component } from "react";
import Navbar from "./Component/Navbar";
import { BrowserRouter, Route } from "react-router-dom";
import AddStudent from "./Component/AddStudent";

import "./App.css";
import SignIn from "./Component/Home";
import AddCourse from "./Component/AddCourse";
import ViewCourse from "./Component/ViewCourse";
import Review from "./Component/Review";

class App extends Component {
  state = {
    signed: false,
    Name: "",
    SID: "",
    message: "",
    waiting: false,
    loginMsg: "",
  };

  signIn = (student) => {
    this.setState({ waiting: true });
    fetch("/login", {
      method: "POST",
      headers: { content_type: "application/json" },
      body: JSON.stringify(student),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json["success"] === "True") {
          this.setState({
            signed: true,
            Name: json["student"][1],
            SID: json["student"][0],
          });

          localStorage.setItem("signed", true);
          localStorage.setItem("Name", json["student"][1]);
          localStorage.setItem("SID", json["student"][0]);
        } else {
          this.setState({
            loginMsg: "Student does not exist",
            waiting: false,
          });
        }
      });
  };

  componentDidMount() {
    var signed = localStorage.getItem("signed");
    console.log(signed);
    if (signed === "true")
      this.setState({
        signed: true,
        Name: localStorage.getItem("Name"),
        SID: localStorage.getItem("SID"),
      });
    else
      this.setState({
        signed: false,
        Name: "",
        SID: "",
      });
  }

  logout = () => {
    this.setState({
      signed: false,
      Name: "",
      SID: "",
      waiting: false,
    });
    localStorage.setItem("signed", false);
  };

  render() {
    return (
      <BrowserRouter>
        <Navbar signed={this.state.signed} />
        <Route
          exact
          path="/"
          render={(props) => (
            <SignIn
              {...props}
              signIn={this.signIn}
              name={this.state.Name}
              waiting={this.state.waiting}
              msg={this.loginMsg}
              signed={this.state.signed}
              logout={this.logout}
            />
          )}
        />
        <Route path="/addStd" component={AddStudent} />
        <Route
          path="/addC"
          render={(props) => (
            <AddCourse
              {...props}
              SID={this.state.SID}
              signed={this.state.signed}
            />
          )}
        />
        <Route path="/lookC" component={ViewCourse} />
        <Route
          path="/addR"
          render={(props) => (
            <Review
              {...props}
              SID={this.state.SID}
              signed={this.state.signed}
            />
          )}
        />
      </BrowserRouter>
    );
  }
}

export default App;
