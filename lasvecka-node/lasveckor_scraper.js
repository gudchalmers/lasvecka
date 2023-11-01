const fs = require('fs');
const axios = require('axios');

function scrape() {
  let url = "https://www.student.chalmers.se/sp/academic_year_list"

  axios.get(url, { responseType: "arraybuffer" }).then((response) => {
    let data = response.data.toString('latin1');
    data = data.replace(/\n/g, '').replace(/\r/g, '').replace(/\t/g, '');
    data = data.match(/<table width="100%" border="0" cellspacing="0" cellpadding="3">(.*?)<\/table>/s)[0]

    // some things to make it nicer
    data = data.replace(/<\/tr>/g, '\n')
    data = data.replace(/<tr align="left">/g, '')
    data = data.replace(/<tr align="left" class="fade">/g, '')
    data = data.replace(/<td>/g, '')
    data = data.replace(/<\/td>/g, '')
    data = data.split('\n')

    let result = {}
    for (let i = 0; i < data.length; i++) {
      let line = data[i]
      if (line.startsWith('Läsperiod')) {
        let date = line.match(/(\d{4}-\d{2}-\d{2})/)[0]
        result[date] = "study_period"
      } else if (line.startsWith('Tentamensperiod')) {
        let date = line.match(/(\d{4}-\d{2}-\d{2})/)[0]
        result[date] = "exam_period"
      } else if (line.startsWith("Omtentamensperiod påsk")) {
        let date1 = line.match(/(\d{4}-\d{2}-\d{2})/)[0]
        let date2 = line.match(/(\d{4}-\d{2}-\d{2})/g)[1]
        result[date1] = "easter_start"
        result[date2] = "easter_end"

        var easter_start = new Date(date1)
        // find first monday after easter
        while (easter_start.getDay() != 1) {
          easter_start.setDate(easter_start.getDate() + 1)
        }
        result[easter_start.toISOString().slice(0, 10)] = "ord_cont"
      }
    }

    // write to json file
    fs.writeFileSync('data.json', JSON.stringify(result))
  })
}