import { Form } from './forms.js'
const DOMAIN = 'https://ajax.test-danit.com/api/cards/'
const user = {
    email: 'example@gmail.com',
    password: 'password',
}

let isClicked = false
const loginBtn = document.querySelector('.btn[data-target="#autorizationModal"]')
const modal = document.querySelector('.modal-ne-bootstrap')

loginBtn.addEventListener('click', showAutorizationModal)

function showAutorizationModal(e) {
    e.preventDefault()
    if (isClicked) return

    const form = new Form('autorization', 'autorization-form')
    modal.append(form.form)

    const submitLoginBtn = document.querySelector('.btn[type="submit"][value="Login"]')
    submitLoginBtn.addEventListener('click', autorization)

    isClicked = true
}
async function autorization(event) {
    event.preventDefault()
    const emailInput = document.querySelector('#autorization-form input[type="email"]')
    const passwordlInput = document.querySelector('#autorization-form input[type="password"]')
    const resonse = await fetch(`${DOMAIN}login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
    })
    const data = await resonse.text()
    loginBtn.value = 'Create visit'
    loginBtn.innerText = 'Create visit'
    loginBtn.removeEventListener('click', showAutorizationModal)
    modal.remove()
    console.log(data)
    return false
}
