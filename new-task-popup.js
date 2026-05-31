const form = document.getElementById('task-form')
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const formdata = new FormData(form);
    console.log(formdata);
    const response = {};

    for (const answer of formdata){
        response[answer[0]] = answer[1];
    };
    
    // need to sterilize start and end time

    addTask(response);

    window.close()
})