import React, { Component } from "react";
import axios from "axios";

class WeekDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: ""
    };
  }

  // React hook to rerender the page when data is successfully loaded from
  // backend
  // Use localhost:5000/getData for dev
  componentDidMount() {
    axios
      .get("http://localhost:5000/getData")
      .then(res => {
        this.setState({
          data: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  /*
    Generates the text to be rendered on the webpage, returns "Självstudier"
    if data hasn't been loaded from the backend.
  */
  genText = () => {
    let data = this.state.data
    if (data !== 'undefined' && data.length > 0) {
      return data;
    } else {
      return "Självstudier"
    }
    
  }

  render() {
    return (
      <div className="WeekDisplay">
        <p className="WeekDisplayText"> {this.genText()}</p>
      </div>
    );
  }
}

export default WeekDisplay;
