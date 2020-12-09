import React, { Component } from "react";
import axios from "axios";
import moment from "moment";

/*
  Hardcoded values because easter periods are inconsistent when trying to
  scrape. Replace/Rewrite if a consistent method to determine LP4 self-study
  periods is found.
*/
const easterStart = "2021-04-01";

const easterEnd = "2021-04-10";

// To set date calculations to the start of the week for easter
const easterEndDiff = "2021-04-12";

class WeekDisplay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };
  }

  // React hook to rerender the page when data is successfully loaded from
  // backend
  // Use localhost:5000/getData for dev
  componentDidMount() {
    axios
      .get("https://api.lasvecka.nu/getData")
      .then(res => {
        this.setState({
          data: res.data
        });
      })
      .catch(err => {
        console.log(err);
      });
  }



  getCurrentDate = () => {
    return moment();
  }

  /*
    Determine what type of period it currently is and which week if it's
    study period. Returns a dictionary containing the type of period and
    number of weeks after the period started.
  */
  getWeekDiffAndType = currentDate => {
    let data = this.state.data;
    let soughtDateType = "";
    let soughtDateWeekDiff = 1000;
    Object.keys(data).forEach(key => {
      let compDate = moment(key).format("YYYY-MM-DD")
      if (currentDate.isSame(compDate)) {
        soughtDateType = data[key]
        soughtDateWeekDiff = 0
      }
      else if (currentDate.isAfter(compDate)) {
        if (currentDate.diff(compDate, 'weeks') < soughtDateWeekDiff) {
          soughtDateType = data[key];
          soughtDateWeekDiff = currentDate.diff(compDate, 'weeks');
        }
      }
    })
    return {"weekDiff": soughtDateWeekDiff + 1, "type": soughtDateType};
  }

  /*
    Generates the text to be rendered on the webpage, checks first if it's
    easter since it needs to be handled differently from normal use cases.
  */
  genText = () => {
    let currentDate = moment();
    if (currentDate.isBetween(easterStart, easterEnd)) {
      return "Självstudier";
    }
    // Compensate for having to skip a week
    else if (currentDate.isSameOrAfter(moment(easterEnd))) {
      let diff = currentDate.diff(easterEndDiff, 'weeks');
      if (diff >= 7) {
        return "Tentavecka";
      }
      return "Lv " + ((diff + 2).toString());
    }
    else {
      let weekDiffAndType = this.getWeekDiffAndType(currentDate);
      if (weekDiffAndType.type == "study_period" && weekDiffAndType.weekDiff <= 8) {
        return ("Lv " + weekDiffAndType.weekDiff.toString());
      } else if (weekDiffAndType.type == "exam_period") {
        return "Tentavecka";
      }
      else {
        // A hack for not returning Självstudier if data hasn't been loaded
        // from the backend yet.
        let data = this.state.data
        if (data !== 'undefined' && data.length > 0) {
          return "Självstudier";
        }
        else {
          return "";
        }
      }
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
