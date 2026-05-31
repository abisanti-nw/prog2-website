const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
// const fs = require('fs');

// const html = fs.readFileSync("./index.html", "utf8");
// const { JSDOM } = require('jsdom');

// const dom = new JSDOM(html);

 
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(express.static(path.join(__dirname)));



/**
 * @typedef {Object} CourseSummary
 * @property {number} id
 * @property {string} name
 */

/**
 * @typedef {Object} AssignmentSummary
 * @property {number} id
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} due_at
 * @property {number} course_id
 * @property {number|null} points_possible
 * @property {string} link
 * @property {boolean} has_submitted_submissions
 */

/**
 * Gets all courses student is enrolled in based on API key in .env
 * @returns {Promise<CourseSummary[]|undefined>}
 */
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

    /** @type {CourseSummary[]} */
    const ret = [];
    for (const course of result) {
      if (course.name != undefined){
        ret.push({ id: course.id, name: course.name });
      }
    }

    return ret;
  } catch (error) {
    console.error(error.message);
  }
  
}

app.get('/api/courses', async (req, res) => {
  const courses = await getStudentCourses()
  res.json(courses || [])
})

/**
 * @param {number} id
 * Gets all assignments from course based on the passed in ID and student api key in .env
 * @returns {Promise<AssignmentSummary[]|undefined>}
 */
async function getCourseAssignments(id){
  //get all the assignments from canvas
  const baseUrl = process.env.BASE_URL;
  const token = process.env.API_KEY;

  const url = baseUrl + `/api/v1/courses/${id}/assignments?per_page=200`;

  try {
    const responce = await fetch(url,{headers : {"Authorization" : `Bearer ${token}`}});

    if (!responce.ok) {
      throw new Error(`Responce status : ${responce.status} (course ${id})`);
    }

    const result = await responce.json();
    /** @type {AssignmentSummary[]} */
    const ret = [];
    for (const assignment of result) {
      ret.push({
        id: assignment.id,
        name: assignment.name,
        description: assignment.description,
        due_at: assignment.due_at,
        course_id: assignment.course_id,
        points_possible: assignment.points_possible,
        link: assignment.html_url,
        submitted: assignment.has_submitted_submissions
      });
    }

    return ret;
  } catch (error) {
    console.error(error.message);
  }
}

/**
 * @returns {Promise<AssignmentSummary[]>}
 */
async function getStudentAssignments() {
  const courses = await getStudentCourses();

  /** @type {AssignmentSummary[]} */
  const ret = [];
  for (const course of courses) {
    const assignments = await getCourseAssignments(course.id);
    if (!assignments) continue;
    for (const assignment of assignments) {
      ret.push(assignment);
    }
  }

  return ret;
}

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

