const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { JSDOM } = require('jsdom');
const dom = new JSDOM("<p>WORK PLEASE<p>");

 
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
  const courses = await getStudentCourses();
  res.json(courses || []);
});

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

async function displayCourses() {
  try {
    // Fetch courses from the Canvas API
    const courses = await getStudentCourses();

    // Create a div for the courses list
    const coursesDiv = document.createElement('div');
  
    coursesDiv.id = 'courses-container';
    coursesDiv.style.padding = '20px';
    

    // Create a list of courses
    const coursesList = document.createElement('div');
    coursesList.id = 'courses-list';

    // Add each course as a list item
    for (const course of courses) {
    
      const listItem = document.createElement('li');
      listItem.textContent = course.name;  // Display course name
      listItem.id = course.id;  // Store course ID for reference
      
      coursesList.appendChild(listItem);
    }

    // Append the list to the container
    coursesDiv.appendChild(coursesList);

    const cal = document.getElementById("cal");

    cal.appendChild(coursesDiv);

} catch (error) {
    console.error('Error fetching courses:', error);}
}

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);

  dom.window.document.addEventListener("DOMContentLoaded", () =>{
    displayCourses();
  })
  
 
});

