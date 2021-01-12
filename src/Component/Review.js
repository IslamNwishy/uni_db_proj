import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import StarRatings from "react-star-ratings";

class Review extends Component {
  state = {
    prefixList: [],
    prefix: "",
    courseList: [],
    reviewList: [],
    ID: "",
    pcode: "",
    code4: "",
    rating: 0,
    text: "",
    Msg: "",
    inForm: false,
    waiting: true,
  };

  color = "text-success";

  componentDidMount() {
    this.changeRating = this.changeRating.bind(this);
    fetch("/prefix", {
      method: "POST",
      headers: { content_type: "application/json" },
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
    fetch("/Reviews", {
      method: "POST",
      headers: { content_type: "application/json" },
      body: JSON.stringify(e.target.value),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        console.log(json["Reviews"]);
        this.setState({ courseList: json["Reviews"], waiting: false });
      });
  };

  changeRating(newRating, name) {
    this.setState({
      rating: newRating,
    });
  }

  handleTextarea = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  };

  AddForm = (e) => {
    const c = e.target.value.split(" ");

    this.setState({
      pcode: c[0],
      code4: c[1],
      ID: this.props.SID,
      inForm: true,
    });
  };

  SubmitForm = (e) => {
    const review = {
      ID: this.state.ID,
      pcode: this.state.pcode,
      code4: this.state.code4,
      rating: this.state.rating,
      text: this.state.text,
    };
    this.setState({ waiting: true });
    e.preventDefault();
    fetch("/insertReview", {
      method: "POST",
      headers: { content_type: "application/json" },
      body: JSON.stringify(review),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        if (json["success"] === "True") {
          this.color = "text-success";

          this.setState({
            inForm: false,
            waiting: false,
            Msg: "Success",
            rating: 0,
            text: "",
            courseList: [],
          });
        } else {
          this.color = "text-danger";
          this.setState({
            inForm: false,
            waiting: false,
            rating: 0,
            text: "",
            Msg: "Failed to submit",
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
                className="btn text-center ml-5 text-left col-10"
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
                <div className="row ml-5">
                  <button
                    name={index}
                    value={item["PCode"] + " " + item["Code4"]}
                    onClick={this.AddForm}
                    className="btn btn-success"
                  >
                    +
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
              {item["Review"] ? (
                item["Review"].map((rev) => {
                  return (
                    <div>
                      <p>
                        <strong className="mr-2">By:</strong>
                        <span>{rev["ID"]}</span>
                        {rev["Verified"] ? (
                          <span className="float-right text-success">
                            Verified
                          </span>
                        ) : (
                          <span className="float-right text-danger">
                            Not Verified
                          </span>
                        )}
                      </p>
                      <p>
                        <strong className="mr-2">Rating:</strong>
                        <StarRatings
                          rating={rev["Rate"]}
                          starRatedColor="gold"
                          numberOfStars={5}
                          starDimension="20px"
                        />
                      </p>
                      <strong>Review:</strong>
                      <p>{rev["Text"]}</p>
                      <hr></hr>
                    </div>
                  );
                })
              ) : (
                <p className="text-center">No Reviews Yet, Be the First</p>
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
            {!this.state.inForm ? (
              <div className="container mt-5">
                <h4 className="text-center">Reviews</h4>
                <p className="text-center">
                  Choose a course to write a review for or see all written
                  reviews about
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
                <div className="fixed-bottom bg-white">
                  <div className="container text-center mt-3 mb-3 ">
                    <p className={this.color}>{this.state.Msg}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form className="container mt-5">
                <h4 className="text-center">Add Course</h4>

                <div className="form-row">
                  <div className="form-group col-md-6">
                    <label htmlFor="PCode">Prefix:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="PCode"
                      value={this.state.pcode}
                      disabled
                    ></input>
                  </div>

                  <div className="form-group col-md-6">
                    <label htmlFor="Code4">Code:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="Code4"
                      value={this.state.code4}
                      disabled
                    ></input>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="ID">ID:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ID"
                      value={this.state.ID}
                      disabled
                    ></input>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label className="mr-3" htmlFor="PCode">
                      Rating:
                    </label>
                    <StarRatings
                      rating={this.state.rating}
                      starRatedColor="gold"
                      changeRating={this.changeRating}
                      numberOfStars={5}
                      starDimension="30px"
                      name="rating"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group col-md-12">
                    <label htmlFor="text">Review Message:</label>
                    <textarea
                      className="form-control"
                      onChange={this.handleTextarea}
                      id="text"
                      rows="5"
                      value={this.state.text}
                    ></textarea>
                  </div>
                </div>

                <button
                  onClick={this.SubmitForm}
                  type="submit"
                  className="btn btn-dark col-5"
                >
                  submit
                </button>
              </form>
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

export default Review;
