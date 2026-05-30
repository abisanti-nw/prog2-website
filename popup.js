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

const form = document.getElementById("class-form");
form.addEventListener('Submit', (e) => {
    console.log('click')
    e.preventDefault()

    const data = new FormData(e.target);
    const formValues = Object.fromEntries(data.entries());

    console.log(formValues)
})

onRun()
