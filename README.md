# Lasvecka

A web-application for displaying the current study week at Chalmers University of Technology.

## How it works

The application is a scraper and a frontend. The scraper scrapes
[student-portal](https://www.student.chalmers.se/sp/academic_year_list) at Chalmers to get dates, which are then used in the frontend to determine the current study week.

## Running the app locally

Use command `docker-compose -f dev.docker-compose.yaml up` to run the dev docker-compose.yml.

## API

Visit https://lasvecka.nu/data for raw data.
