'use strict'
import { Form } from './forms.js'

const DOMAIN = 'https://ajax.test-danit.com/api/v2/cards'
const loginBtn = document.querySelector('.btn[data-target="#autorizationModal"]')
const modal = document.querySelector('.modal-ne-bootstrap')
const visitForm = new Form('visit', 'create-visit')
const autorizationForm = new Form('autorization', 'autorization-form')
loginBtn.addEventListener('click', showAutorizationModal)

document.addEventListener('DOMContentLoaded', () => {
    const isAutorizated = checkSessinon('autorizated')
    if (isAutorizated) {
        showVisitForm()
        changeButtonText(loginBtn, 'Create visit', 'create visit')
        loginBtn.removeEventListener('click', showAutorizationModal)
    }
})

function checkSessinon(key) {
    if (localStorage.getItem(key)) return true
    else return false
}
function changeButtonText(button, text, value) {
    button.innerText = text
    button.value = value
}
function showAutorizationModal(event) {
    event.preventDefault()
    modal.append(autorizationForm.form)
    loginBtn.removeEventListener('click', showAutorizationModal)

    const submitBtn = document.querySelector('#autorization-form  input[type="submit"]')
    submitBtn.addEventListener('click', (event) => login(event, autorizationForm))
}
function showVisitForm(event) {
    if (event) event.preventDefault()
    modal.append(visitForm.form)

    const doctors = document.querySelector('.doctors-list')
    doctors.addEventListener('change', showFields)
    function showFields() {
        const commonFields = document.querySelectorAll('#create-visit .common')
        const cardiologistFields = document.querySelector('#create-visit .cardiologist-group')
        const lastVisitField = document.querySelector('#create-visit .last-visit')
        const ageField = document.querySelector('#create-visit .age')
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

async function login(event, form) {
    const email = document.querySelector('#autorization-form  input[type="email"]')
    const password = document.querySelector('#autorization-form  input[type="password"]')
    const requestObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.value, password: password.value }),
    }
    const getToken = await form.submit(event, `${DOMAIN}/login`, requestObj, 'TEXT')
    if (getToken) {
        modal.innerHTML = ''
        localStorage.setItem('autorizated', getToken)
        loginBtn.addEventListener('click', showVisitForm)
        changeButtonText(loginBtn, 'Create visit', 'create visit')
    } else {
        form.form.insertAdjacentHTML('beforeend', `<p style="color: tomato">Неверный логин или пароль</p>`)
    }
}

function createVisit() {
    const token = localStorage.getItem('autorizated')
    visitForm.form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const prioritySelect = document.querySelector('#create-visit .priority')
        if (prioritySelect.value === 'Priority') {
            visitForm.form.insertAdjacentHTML('beforeend', '<div style="color: tomato"> Необходимо выбрать приоритет</div>')
            return
        }

        const checkKeys = {
            name: document.querySelector('#create-visit .name').value,
            doctor: document.querySelector('#create-visit .doctors-list').value,
            description: document.querySelector('#create-visit .visit-goal').value,
            age: document.querySelector('#create-visit .age').value,
            priority: prioritySelect.value,
            bp: document.querySelector('#create-visit .pressure').value,
            weight: document.querySelector('#create-visit .body-weight').value,
            heartDiseases: document.querySelector('#create-visit .diseases').value,
            heartDiseases: document.querySelector('#create-visit textarea').value,
            lastVisit: document.querySelector('#create-visit .last-visit').value,
        }
        for (let key in checkKeys) {
            if (!checkKeys[key].trim()) {
                delete checkKeys[key]
            }
        }
        const requestObj = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ ...checkKeys }, null, '\t'),
        }
        const data = await visitForm.submit(event, DOMAIN, requestObj, 'JSON')
        console.log(data)
    })
}
createVisit()
async function get() {
    const response = await fetch('https://ajax.test-danit.com/api/v2/cards', {
        method: 'GET',
        headers: {
            Authorization: `Bearer d6fcc7cd-ddeb-40b8-9cde-465a6f4c5ea3`,
        },
    })
    console.log(response)
    const d = await response.json()
    console.log(d)
}
get()
