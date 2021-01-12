import React, { Component } from "react";
import { ClipLoader } from "react-spinners";

class ViewCourse extends Component {
  state = {
    prefixList: [],
    prefix: "",
    courseList: [],
    waiting: true,
  };

  componentDidMount() {
    fetch("/prefix", {
      method: "POST",
      headers: { content_type: "application/json" },
      body: JSON.stringify(this.props.SID),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({ prefixList: json["Prefixes"], waiting: false });
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      waiting: true,
    });
    fetch("/Courses", {
      method: "POST",
      headers: { content_type: "application/json" },
      body: JSON.stringify(e.target.value),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json["Courses"]);
        this.setState({ courseList: json["Courses"], waiting: false });
      });
  };

  render() {
    const prefixList = this.state.prefixList.map((item) => {
      return (
        <option value={item["PCode"]}>
          {item["PCode"] + " (" + item["PName"] + ")"}
        </option>
      );
    });

    const courseList = this.state.courseList.map((item, index) => {
      return (
        <div className="card mt-2 mb-2">
          <div
            className="card-header p-1 btn-secondary"
            id={"heading" + index.toString()}
          >
            <button
              className="btn text-center btn-block"
              type="button"
              data-toggle="collapse"
              data-target={"#Card" + index.toString()}
              aria-controls={index.toString()}
            >
              {item["PCode"] +
                " " +
                item["Code4"] +
                "/" +
                item["Code3"] +
                " " +
                item["CName"] +
                " cr. " +
                item["Credits"]}
            </button>
          </div>
          <div
            id={"Card" + index.toString()}
            className="collapse"
            aria-labelledby={"heading" + index.toString()}
            data-parent="#accordionExample"
          >
            <div className="card-body">
              {item["PCode_Req"] ? (
                <div>
                  <strong>Prerequsites</strong>
                  <br></br>
                  {item["PCode_Req"].split(",").map((req, index) => {
                    return <span>{index === 0 ? req : ", " + req}</span>;
                  })}
                </div>
              ) : (
                ""
              )}

              {item["Description"] ? (
                <div>
                  <strong>Description</strong>
                  <p>{item["Description"]}</p>
                </div>
              ) : (
                ""
              )}
              {item["Note"] ? (
                <div>
                  <strong>Notes</strong>
                  <p>{item["Note"]}</p>
                </div>
              ) : (
                ""
              )}

              {item["PCode_2"] ? (
                <div>
                  <strong>Cross-Listed</strong>
                  <p>{item["PCode_2"] + " " + item["Code4_2"]}</p>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      );
    });

    return (
      <div>
        {!this.state.waiting ? (
          <div className="container mt-5">
            <h4 className="text-center">View Course</h4>

            <select
              id="prefix"
              value={this.state.prefix}
              onChange={this.handleChange}
              className="custom-select font-weight-bold"
            >
              <option value="" disabled unselectable selected>
                Choose a Course Prefix
              </option>
              {prefixList}
            </select>
            <div className="mb-2"></div>
            <div className="accordion" id="accordionExample">
              {courseList}
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

export default ViewCourse;
