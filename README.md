# University Portal Prototype

This project was made as a prototype for a University portal based on the [American University in Cairo (AUC) Catalog](http://catalog.aucegypt.edu/index.php?catoid=36).

The project was done in 4 days and is intended as a submission for the Fundamentals of Database Systems Course at the AUC.

## What it Does

- Allows a student to sign up/log in to the portal using his/her UID
- Allows a student to view the details and prerequisites of every course offered by the university, ordered by the departments. (based on the AUC 2019-2020 catalog).
- Allows the student to add the courses they have taken and the grades they got in these courses. The student should only see the courses that they finished at least 1 of their prerequisites or the courses that do not require anything prior. (this section will be only available if a valid SID was previously logged in)
- Allows the student to write and see reviews made on any course. If the student did not take the course their review will be flagged as Not Verified. (this section will be only available if a valid SID was previously logged in)

## Could be added

- Allowing the student to see a history of the courses they have taken and the grades they got in them
- Calculating the overall GPA of the student

## Tools Used

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Backend using python's [Flask](https://flask.palletsprojects.com/en/1.1.x/)

## How To Run

- Included in the directory `.\api` are two environments, one to run the code on windows named `venv-win` and another to run it on linux named `venv` based on the OS that you will be running this on, you can simply delete the venv file that you do not need.
- To start up the api run the command `npm run start-flask-api-win` or `npm run start-flask-api` based on your OS
- In a separate terminal/command prompt instance, run the command `npm start` that should in turn start a local server for you at `http://localhost:3000/` and start the web app
- You also need to set up the database either locally or remotely and type the appropriate credentials in the top part of the api.py file. (see section below for the database details)
- the node_modules are not included as well so you might need to run `npm install`

## Database

This was made using a relational database with MySQL. The relational model was made after analysing the AUC catalog and the project requirements.

- Relational Model

  - department (<ins>DName</ins>)
  - prefix (<ins>PCode</ins>, PName, DName)
    - FK: DName -> department
  - course (<ins>PCode, Code4</ins>, Code3, CName, Credits, Description, Note)
    - FK: PCode -> prefix
  - course prereq (<ins>PCode_Parent, Code4_Parent, PCode_Req, Code4_Req</ins>)
    - FK: PCode_Parent, Code4_Parent, PCode_Req, Code4_Req -> course
  - cross_list (<ins>PCode_1, Code4_1, PCode_2, Code4_2</ins>)
    - FK: PCode_1, Code4_1, PCode_2, Code4_2 -> course
  - course semester(<ins>PCode, Code4, Season</ins>)
    - FK: PCode, Code4 -> course
  - student (<ins>ID</ins>, SName, Standing, DName)
    - FK: DName -> department
  - review (<ins>ID, PCode, Code4</ins>, Rating, TextReview)
    - FK: ID -> student
    - PCode, Code4 -> course

- Included in the root folder of the project is a MySQL dump named `127_0_0_1.sql.zip` of the whole database. (the script should create the tables as well but not the schema).
