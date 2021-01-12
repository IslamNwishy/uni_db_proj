import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { ClipLoader } from "react-spinners";

class AddCourse extends Component {
  state = {
    prefixList: [],
    prefix: "",
    courseList: [],
    added: [],
    Msg: "",
    waiting: true,
  };
  color = "text-success";
  AddClass =
    "col-lg-5 col-sm-12 btn btn-outline-success btn-lg pt-0 pb-1 pr-2 pl-2 ml-2 mt-2 mt-lg-0";
  RemoveClass =
    "col-lg-5 col-sm-12 btn btn-outline-danger btn-lg pt-0 pb-1 pr-2 pl-2 ml-2 mt-2 mt-lg-0";
  componentDidMount() {
    console.log(this.props.signed);
    fetch("/prefix", {
      method: "POST",
      headers: { content_type: "application/json" },
      body: JSON.stringify(this.props.SID),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.setState({
          prefixList: json["Prefixes"],
          waiting: false,
        });
      });
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      waiting: true,
    });
    fetch("/availCourses", {
      method: "POST",
      headers: { content_type: "application/json" },
      body: JSON.stringify({
        pcode: e.target.value,
        ID: this.props.SID,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        for (var i in json["Courses"]) json["Courses"][i]["btnState"] = "+";
        console.log(json["Courses"]);
        this.setState({
          courseList: json["Courses"],
          added: [],
          waiting: false,
        });
      });
  };

  handleSelect = (e) => {
    if (e.target.nextElementSibling.textContent === "-") {
      const check = e.target.nextElementSibling.value;
      const addedt = this.state.added;
      for (var i in addedt) {
        if (addedt[i]["course"] === check) {
          addedt[i]["grade"] = e.target.value;
          break;
        }
      }
      console.log(addedt);
      this.setState({ added: addedt });
    }
  };

  handlebtntext(e, value) {
    const items = this.state.courseList;
    items[e.target.name]["btnState"] = value;
    this.setState({
      courseList: items,
    });
  }

  handleAdd(e) {
    const add = {
      course: e.target.value,
      grade: e.target.previousElementSibling.value,
    };
    const addedt = [...this.state.added, add];

    this.handlebtntext(e, "-");

    this.setState({
      added: addedt,
    });
    console.log(addedt);
  }

  handleRemove(e) {
    const check = e.target.value;
    const addedt = this.state.added.filter((item) => {
      return item["course"] !== check;
    });
    this.handlebtntext(e, "+");
    this.setState({
      added: addedt,
    });
    console.log(addedt);
  }

  handleAddRemove = (e) => {
    if (e.target.textContent === "+") this.handleAdd(e);
    else this.handleRemove(e);
  };

  submitCourses = (e) => {
    this.setState({ waiting: true });
    fetch("/insertCourses", {
      method: "POST",
      headers: { content_type: "application/json" },
      body: JSON.stringify({
        ID: this.props.SID,
        Courses: this.state.added,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json["success"] === "True") {
          this.color = "text-success";
          this.setState({
            courseList: [],
            added: [],
            prefix: "",
            Msg: "Courses Added Successfully",
            waiting: false,
          });
        } else {
          this.color = "text-danger";
          this.setState({
            Msg: json["left"] + " Course(s) Could not be Added",
            waiting: false,
          });
        }
      });
  };

  render() {
    if (!this.props.signed) return <Redirect to="/" />;
    const prefixList = this.state.prefixList.map((item) => {
      return (
        <option value={item["PCode"]}>
          {item["PCode"] + " (" + item["PName"] + ")"}
        </option>
      );
    });

    const courseList = this.state.courseList.map((item, index) => {
      return (
        <div className="card mt-2 mb-2 col-12 btn-outline-secondary">
          <div
            className="card-header p-1 bg-transparent"
            id={"heading" + index.toString()}
          >
            <h2 className="mb-0 row">
              <button
                className="btn text-center  text-left col-10"
                type="button"
                data-toggle="collapse"
                data-target={"#Card" + index.toString()}
                aria-expanded="true"
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
              <span className=" col">
                <div className="row">
                  <select
                    className="form-control col-sm-12 col-lg-5  ml-2 mr-2"
                    onChange={this.handleSelect}
                  >
                    <option value="1">A</option>
                    <option value="2">A-</option>
                    <option value="3">B+</option>
                    <option value="4">B</option>
                    <option value="5">B-</option>
                    <option value="6">C+</option>
                    <option value="7">C</option>
                    <option value="8">C-</option>
                    <option value="9">D+</option>
                    <option value="10">D</option>
                    <option value="11">F</option>
                  </select>
                  <button
                    name={index}
                    value={item["PCode"] + " " + item["Code4"]}
                    onClick={this.handleAddRemove}
                    className={
                      item["btnState"] === "+"
                        ? this.AddClass
                        : this.RemoveClass
                    }
                  >
                    {item["btnState"]}
                  </button>
                </div>
              </span>
            </h2>
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
          <div>
            <div className="container mt-5">
              <h4 className="text-center">Add Course</h4>
              <p className="text-center">
                Shown here are all courses that this student can register to
              </p>
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
              <div className="accordion pb-5 mb-5" id="accordionExample">
                {courseList}
              </div>
            </div>
            {this.state.added.length > 0 ? (
              <div className="fixed-bottom bg-white">
                <div className="container text-center mt-3 mb-3 ">
                  <p className={this.color}>{this.state.Msg}</p>

                  <button
                    onClick={this.submitCourses}
                    className="btn btn-outline-secondary col-5"
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <div className="fixed-bottom bg-white">
                <div className="container text-center mt-3 mb-3 ">
                  <p className={this.color}>{this.state.Msg}</p>
                </div>
              </div>
            )}
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

export default AddCourse;
