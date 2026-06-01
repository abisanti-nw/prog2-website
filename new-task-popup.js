const form = document.getElementById('task-form')
form.addEventListener('submit', (e) =>{
    
    e.preventDefault();
    
    const formdata = new FormData(form);
    console.log(formdata);
    const response = {};

    for (const answer of formdata){
        response[answer[0]] = answer[1];
    };

    for (const key in response){
        localStorage.setItem(`task_${key}`, response[key])
    }
    localStorage.setItem('submitted', 'true')

    window.close()
})