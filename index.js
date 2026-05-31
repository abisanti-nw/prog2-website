document.getElementById('course-popup-button').addEventListener('click', () => {
  window.open('class-sync-popup.html', '_blank', 'width=500, height = 500');
});

document.getElementById('task-popup-button').addEventListener('click', () => {
  window.open('new-task-popup.html', '_blank', 'width=500, height=500')
})

async function addTask(task) {
  const name = task['task-name']
  const description = task['task-description']
  start_time = task['start-time']
  end_time = task['end-time']

  let start_time = Number(response['start-time'])
  start_time = start_time / 60
    
  let end_time = Number(response['start-time'])
  end_time = end_time / 60 
  ent_time = end_time.toFixed(4)
  
  document.createElement()
}
