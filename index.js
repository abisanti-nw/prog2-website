function setWeekDays(){
  const today = new Date();

  const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
  const sundayDate = today.getDate() - dayOfWeek; // Calculate the distance to the most recent Sunday, because today.getDate is the day of the month, and the current date is always dayOfWeek days after the Sunday of that week
  const startOfWeek = new Date(today.setDate(sundayDate)); // Get the date of the most recent Sunday by setting the day of the month to the date of the most recent Sunday

  const weekDayMap = {
    0: 'Sunday',
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday'
  }
  
  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(startOfWeek);
    nextDate.setDate(startOfWeek.getDate() + i);

    const dayName = nextDate.toLocaleDateString('en-US', { weekday: 'long' }); // Get the day name
    console.log(dayName)
    const dayNumber = nextDate.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric'}); // Get the month and day number
    const headerText = `${dayName} ${dayNumber}`; // Combine the day name and number
  
    const weekday = document.querySelectorAll(`.${dayName}`)
    weekday.forEach(day => {
      day.textContent = headerText; 
    })
  }
}

document.addEventListener('DOMContentLoaded', setWeekDays);

function setClassFromLocalStorage() {
  //get class information
  let className = localStorage.getItem('class_classes')
  let classBlock = localStorage.getItem('class_blocks')
  let submitted = localStorage.getItem('submitted')

  if (submitted !== 'true'){
    localStorage.clear()
    return
  }

  const blocks = document.querySelectorAll(`.${classBlock}`)

  blocks.forEach(block => {
    block.textContent = className
  })

  localStorage.clear()
} 

const classPopupButton = document.getElementById('course-popup-button')
classPopupButton.addEventListener('click', () => {
  const classPopup = window.open('class-sync-popup.html', '_blank', 'width=550, height = 500');

  const checkClosed = setInterval(() => {
    if (classPopup.closed) {
      clearInterval(checkClosed);
      setClassFromLocalStorage();
    }
  }, 500)
});


function addTaskFromLocalStorage() {
  // Get task information from local storage
  let taskName = localStorage.getItem('task_task-name');
  let taskDescription = localStorage.getItem('task_task-description');
  let taskStartMinute = localStorage.getItem('task_start-minute');
  let taskStartHour = localStorage.getItem('task_start-hour');
  let taskStartAMOrPM = localStorage.getItem('task_start-AM-PM');
  let taskEndMinute = localStorage.getItem('task_end-minute');
  let taskEndHour = localStorage.getItem('task_end-hour');
  let taskEndAMOrPM = localStorage.getItem('task_end-AM-PM');
  const taskDay = localStorage.getItem('task_task-day');
  const taskSubmitted = localStorage.getItem('submitted');


  // Ensure that the task was submitted (if the window was just closed, this function is still called)
  if(taskSubmitted !== 'true'){
    localStorage.clear();
    return;
  }
  

  //Get the task start and end times, then convert them into which grid row they need to be in
  let taskStart = 0

  if (taskStartAMOrPM === 'PM'){
    taskStart = (Number(taskStartHour) + 12) * 60 + Number(taskStartMinute);
  }
  else{
    taskStart = Number(taskStartHour) * 60 + Number(taskStartMinute);
  }
  taskStart = taskStart + 60;

  let taskEnd = 0;

  if (taskEndAMOrPM === 'PM'){
    taskEnd = (Number(taskEndHour) + 12) * 60 + Number(taskEndMinute);
  }
  else{
    taskEnd = Number(taskEndHour) * 60 + Number(taskEndMinute);
  }

  taskEnd = taskEnd + 60;

  //Get how many grid rows long the task is

  const taskLength = taskEnd - taskStart;

  
  //Create the HTML element that will represent the task, and position it

  const taskBox = document.createElement('div');
  taskBox.classList.add('task')
  taskBox.innerHTML = `<p>${taskName}</p>`;
  taskBox.style.gridRow = `${taskStart} / span ${taskLength}`;
  taskBox.style.gridColumn = Number(taskDay) + 1;

  //Create the task delete button

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'X';
  deleteButton.classList.add('delete-button');

  //Remove the task when button is clicked

  deleteButton.addEventListener('click', () => {
    taskBox.remove();
  });

  taskBox.appendChild(deleteButton)
  


  // Insert the task into the calendar
  const cal = document.getElementById('cal');
  cal.appendChild(taskBox);
  localStorage.clear();
}

// When the add task button is clicked, open the popup, then check if it was closed every 0.5s. When closed, runs addTaskFromLocalStorage
const taskPopupButton = document.getElementById('task-popup-button');
taskPopupButton.addEventListener('click', () => {

  const taskPopup = window.open('new-task-popup.html', '_blank', 'width=500, height=500');

  const checkClosed = setInterval(() => {
    if (taskPopup.closed) {
      clearInterval(checkClosed);
      addTaskFromLocalStorage();
    }
  }, 500);
});