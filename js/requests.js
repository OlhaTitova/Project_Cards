import { Form } from './forms.js'
const DOMAIN = 'https://ajax.test-danit.com/api/cards/'
const user = {
    email: 'example@gmail.com',
    password: 'password',
}

const loginBtn = document.querySelector('.btn[data-target="#autorizationModal"]')
const modal = document.querySelector('.modal-ne-bootstrap')

loginBtn.addEventListener('click', showAutorizationModal)
function showAutorizationModal(event) {
    event.preventDefault()
    loginBtn.removeEventListener('click', showAutorizationModal)

    const form = new Form('autorization', 'autorization-form')
    modal.append(form.form)

    const submitBtn = document.querySelector('#autorization-form  input[type="submit"]')
    submitBtn.addEventListener('click', async (event) => {
        const email = document.querySelector('#autorization-form  input[type="email"]')
        const password = document.querySelector('#autorization-form  input[type="password"]')
        const requestObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email.value, password: password.value }),
        }
        const data = await form.submit(event, `${DOMAIN}login`, requestObj, 'TEXT')
        if (data) {
            loginBtn.value = 'Create visit'
            loginBtn.innerText = 'Create visit'
            modal.innerHTML = ''
        } else {
            console.log(data)
            form.form.insertAdjacentHTML('beforeend', `<p style="color: tomato">Неверный логин или пароль</p>`)
        }
    })
}
