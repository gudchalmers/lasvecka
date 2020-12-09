# Lasvecka
A web-application  for displaying the current study week at Chalmers University of Technology. 

## How it works
The application is divided into a frontend running React.js, and a backend hosting a python-flask server. The backend scrapes the 
[student-portal](https://student.portal.chalmers.se/sv/chalmersstudier/Sidor/Lasarstider.aspx) at Chalmers to get dates, which are then used in the frontend to determine the current study week.

## Running the app locally
First, change the code in `WeekDisplay.js` and `app.py` to use localhost:
```javascript
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
```
```python
  if __name__ == '__main__':
      # Dev purposes only
      # app.run(host="0.0.0.0")

      # For prod
      serve(app, listen='0.0.0.0:5000')
```
Use command `docker-compose -f dev.docker-compose.yaml up` to run the dev docker-compose.yml.
