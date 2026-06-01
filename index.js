document.getElementById('course-popup-button').addEventListener('click', () => {
  const class_popup = window.open('class-sync-popup.html', '_blank', 'width=500, height = 500');
});


function addTaskFromLocalStorage() {
  let task_name = localStorage.getItem('task_task-name');
  let task_description = localStorage.getItem('task_task-description');
  let task_start_minute = localStorage.getItem('task_start-minute');
  let task_start_hour = localStorage.getItem('task_start-hour');
  let task_start_AM_or_PM = localStorage.getItem('task_start-AM-PM');
  let task_end_minute = localStorage.getItem('task_end-minute');
  let task_end_hour = localStorage.getItem('task_end-hour');
  let task_end_AM_or_PM = localStorage.getItem('task_end-AM-PM');
  
  let task_start = 0

  if (task_start_AM_or_PM === 'PM'){
    task_start = (Number(task_start_hour) + 12) * 60 + Number(task_start_minute);
  }
  else{
    task_start = Number(task_start_hour) * 60 + Number(task_start_minute);
  }
  task_start = task_start + 60;

  let task_end = 0

  if (task_end_AM_or_PM === 'PM'){
    task_end = (Number(task_end_hour) + 12) * 60 + Number(task_end_minute);
  }
  else{
    task_end = Number(task_end_hour) * 60 + Number(task_end_minute);
  }
  task_end = task_end + 60;

  const task_length = task_end - task_start;

  
  const task_box = document.createElement('div')
  task_box.innerHTML = `<p>${task_name}</p>`;
  task_box.style.gridRow = `${task_start} / span ${task_length}`
  task_box.style.borderLeft = '1px solid black'
  task_box.style.borderRight = '1px solid black'
  task_box.style.borderTop = '1px solid black'
  task_box.style.borderBottom = '1px solid black'
  task_box.style.backgroundColor = "#ffffff"
  task_box.style.gridColumn = '3'

  const cal = document.getElementById('cal');
  cal.appendChild(task_box);
  localStorage.clear();
}


const task_popup_button = document.getElementById('task-popup-button')

task_popup_button.addEventListener('click', () => {

  const task_popup = window.open('new-task-popup.html', '_blank', 'width=500, height=500')

  const checkClosed = setInterval(() => {
    if (task_popup.closed) {
      clearInterval(checkClosed);
      addTaskFromLocalStorage();
    }
  }, 500);
})


