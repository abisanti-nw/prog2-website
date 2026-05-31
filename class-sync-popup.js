async function onRun() {
    const res = await fetch('/api/courses');
    const courses = await res.json();

    const coursesGroup = document.getElementById('classes-group');

    for (const course of courses){
        const option = document.createElement('option');
        option.textContent = course.name;
        coursesGroup.appendChild(option)
    }
}

const form = document.getElementById('class-form')
form.addEventListener('submit', (e) =>{
    e.preventDefault();
    const responce = new FormData(form);
    
    for (const answer of responce){
        localStorage.setItem(answer[0], answer[1])
    }

    window.close()
})

onRun()
