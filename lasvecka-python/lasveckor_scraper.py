import requests
import json
from bs4 import BeautifulSoup

url = 'https://student.portal.chalmers.se/sv/chalmersstudier/Sidor/Lasarstider.aspx'

response = requests.get(url)

soup = BeautifulSoup(response.text, "html.parser")

text = soup.findAll('span')

# For debugging purposes
def test_scrape():
    # Test the output of scraper
    current_line = 0
    for line in text:
        if line.string is not None:
            if "Självstudier" in line.string or "påsk" in line.string:
                print(text[current_line + 2].string)
        current_line = current_line + 1


# Iterate through text to find specific lines which are then used to determine
# the position of sought dates. Dumps the results as a json-formatted object
# in source directory in a txt file
def scrape():
    # Store dates when a period starts
    data = {}
    current_line = 0
    for line in text:
        if line.string is not None:
            if "Läsperiod" in line.string:
                # print(text[current_line + 2].string)
                data[text[current_line + 2].string] = "study_period"
                # data.append((text[current_line + 2].string, "study_period"))
            if "Tentamensperiod" in line.string:
                # print(text[current_line + 2].string)
                # data.append((text[current_line + 2].string, "exam_period"))
                data[text[current_line + 2].string] = "exam_period"
            # if "Omtentamensperiod" in line.string:
                # print(text[current_line + 2].string)
                # data.append((text[current_line + 2].string, "reexam_period"))
                # data[text[current_line + 2].string] = "reexam_period"
        current_line = current_line + 1
    with open('data.txt', 'w') as outfile:
        outfile.write(json.dumps(data))


if __name__ == '__main__':
    # test_scrape()
    scrape()
