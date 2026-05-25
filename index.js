const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Returns a list of all courses the student is enrolled in.
async function getStudentCourses() {
  //get all the data from canvas
  const baseUrl = process.env.BASE_URL;
  const token = process.env.API_KEY;

  const url = baseUrl + '/api/v1/courses?per_page=100';

  try {
    const responce = await fetch(url,{headers : {"Authorization" : `Bearer ${token}`}});

    if (!responce.ok) {
      throw new Error(`Responce status : ${responce.status}`);
    }

    const result = await responce.json();
    const ret = [];
    for (const course of result) {
      ret.push({ id: course.id, name: course.name });
    }

    return ret;
  } catch (error) {
    console.error(error.message);
  }
  
}


const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  getStudentCourses().then(console.log);
});

