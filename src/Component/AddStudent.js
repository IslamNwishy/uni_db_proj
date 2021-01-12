import React, { Component } from "react";
import { ClipLoader } from "react-spinners";

class AddStudent extends Component {
  state = {
    name: "",
    SID: "",
    standing: "Freshman",
    department: "null",
    message: "",
    deptList: [],
    waiting: true,
  };
  color = "text-success";

  ErrorMsgs = {
    1062: "Duplicate Entry (Student Already Exists)",
    1452: "The Given Department Does not Exist",
    1406: "Data Inputed is too Long",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const SID = this.state.SID;
    if (SID.length !== 9 || isNaN(SID) || SID.substring(0, 3) !== "900") {
      this.color = "text-danger";
      this.setState({
        message:
          "Invalid format for the 'ID', Make sure it is 9 digits in the form of 900XXXXXX",
        waiting: true,
      });
      return;
    }
    fetch("/register", {
      method: "POST",
      headers: { content_type: "application/json" },
      body: JSON.stringify(this.state),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json["success"] === "False") {
          this.color = "text-danger";
          this.setState({
            message: this.ErrorMsgs[json["Msg"].substring(1, 5)],
            waiting: false,
          });
        } else {
          this.color = "text-success";
          this.setState({
            message: json["Msg"],
            name: "",
            SID: "",
            standing: "Freshman",
            department: "null",
            waiting: false,
          });
        }
      });
  };

  componentDidMount() {
    fetch("/depts", {
      method: "POST",
      headers: { content_type: "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({ deptList: json["depts"], waiting: false });
      });
  }

  render() {
    const depts = this.state.deptList.map((dept) => {
      return <option value={dept}>{dept}</option>;
    });

    return (
      <div>
        {!this.state.waiting ? (
          <div className="container mt-5">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                  value={this.state.name}
                  className="form-control"
                  type="text"
                  id="name"
                  required
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="SID">ID:</label>
                <input
                  value={this.state.SID}
                  className="form-control"
                  type="text"
                  id="SID"
                  required
                  onChange={this.handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="standing">Standing:</label>
                <select
                  value={this.state.standing}
                  id="standing"
                  onChange={this.handleChange}
                  className="custom-select"
                >
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="department">Department:</label>
                <select
                  id="department"
                  value={this.state.department}
                  onChange={this.handleChange}
                  className="custom-select"
                >
                  <option value="null">Undeclared</option>
                  {depts}
                </select>
              </div>
              <div className="text-center">
                <button className="btn btn-dark w-25">Submit</button>
              </div>
            </form>
            <div className="mt-3">
              <strong>
                <p className={this.color}>{this.state.message}</p>
              </strong>
            </div>
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
  }
}

export default AddStudent;
