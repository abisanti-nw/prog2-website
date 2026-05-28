/**
 * Fetch courses from the API and they are linked to the script object in index.html
 */
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
    console.log(coursesList);
    for (const course of courses) {
    
      const listItem = document.createElement('li');
      console.log(course)
      listItem.textContent = course.name;  // Display course name
      listItem.id = course.id.toString();  // Store course ID for reference
      console.log("ListItem:")
      console.log(listItem)
      console.log("coursesList before appending:")
      console.log(coursesList)
      coursesList.appendChild(listItem);
      console.log("coursesList after appending:")
      console.log(coursesList)
    }
    console.log(coursesDiv);
    
    // Append the list to the container
    coursesDiv.appendChild(coursesList);

    const cal = document.getElementById("cal");

    cal.appendChild(coursesDiv);
    console.log(cal)

    
} catch (error) {
    console.error('Error fetching courses:', error);}
};

document.addEventListener('DOMContentLoaded', () => {
  displayCourses()
})