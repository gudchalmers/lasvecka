const fs = require('fs');
const axios = require('axios');

async function scrape() {
  console.log("Scraping data from student.chalmers.se")
  let url = "https://www.student.chalmers.se/sp/academic_year_list"

  const response = await axios.get(url, { responseType: "arraybuffer" })
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
      result["easter_start"] = date1
      result["easter_end"] = date2

      var easter_start = new Date(date1)
      // find first monday after easter
      while (easter_start.getDay() != 1) {
        easter_start.setDate(easter_start.getDate() + 1)
      }
      result["ord_cont"] = easter_start.toISOString().slice(0, 10)
    }
  }

  result["updated"] = new Date().toISOString().slice(0, 10)
  await fs.promises.writeFile('data.json', JSON.stringify(result))
  return result
}

module.exports = scrape;