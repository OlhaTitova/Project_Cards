'use strict'
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
    submitBtn.addEventListener('click', (event) => login(event, form))
}
async function login(event, form) {
    const email = document.querySelector('#autorization-form  input[type="email"]')
    const password = document.querySelector('#autorization-form  input[type="password"]')
    const requestObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // body: JSON.stringify({ email: email.value, password: password.value }),
        body: JSON.stringify(user),
    }
    const data = await form.submit(event, `${DOMAIN}login`, requestObj, 'TEXT')
    if (data) {
        loginBtn.value = 'create visit'
        loginBtn.innerText = 'Create visit'
        modal.innerHTML = ''
        loginBtn.addEventListener('click', createVisit)
    } else {
        console.log(data)
        form.form.insertAdjacentHTML('beforeend', `<p style="color: tomato">Неверный логин или пароль</p>`)
    }
}
async function createVisit(event) {
    event.preventDefault()
    const visitForm = new Form('visit', 'create-visit')
    modal.append(visitForm.form)

    const doctors = document.querySelector('.doctors-list')
    doctors.addEventListener('change', showFields)
    function showFields(e) {
        const commonFields = document.querySelectorAll('#create-visit .common')
        const cardiologistFields = document.querySelector('.cardiologist-group')
        const lastVisitField = document.querySelector('#create-visit .last-visit')
        const ageField = document.querySelector('#create-visit .age-field')
        const selected = doctors.value

        for (let field of commonFields) {
            field.hidden = false
        }
        if (selected === 'Cardiologist') {
            cardiologistFields.hidden = false
            lastVisitField.hidden = true
            ageField.hidden = false
        }
        if (selected === 'Dentist') {
            cardiologistFields.hidden = true
            lastVisitField.hidden = false
            ageField.hidden = true
        }
        if (selected === 'Therapist') {
            cardiologistFields.hidden = true
            lastVisitField.hidden = true
            ageField.hidden = false
        }
    }
}
