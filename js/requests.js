'use strict'
import { Form } from './forms.js'
import { createModal } from './cardsFunctions.js'

const DOMAIN = 'https://ajax.test-danit.com/api/v2/cards'
const loginBtn = document.querySelector('[data-target="#authorizationModal"]')
const createVisitBtn = document.querySelector('[data-target="#formModal"]')
const visitForm = new Form('visit', 'create-visit')
const autorizationForm = new Form('autorization', 'autorization-form')
loginBtn.addEventListener('click', showAutorizationModal)
document.addEventListener('DOMContentLoaded', checkSession)

function checkSession() {
    const isAutorizated = localStorage.getItem('autorizated')
    if (isAutorizated) {
        showVisitForm()
        // changeButton(loginBtn, 'Создать визит', 'create visit', '#formModal')
        loginBtn.hidden = true
        // loginBtn.removeEventListener('click', showAutorizationModal)
    }
}
// function changeButton(button, text, value, attr) {
//     button.innerText = text
//     button.value = value
//     button.setAttribute('data-target', '#formModal')
// }
function showAutorizationModal(event) {
    event.preventDefault()
    createModal(event)

    const modalBody = document.querySelector('#authorizationModal .modal-body')
    modalBody.append(autorizationForm.form)
    // loginBtn.removeEventListener('click', showAutorizationModal)

    const submitBtn = document.querySelector('#autorization-form  input[type="submit"]')
    submitBtn.setAttribute('data-dismiss', 'modal')
    submitBtn.addEventListener('click', (event) => login(event, autorizationForm))
}
function showVisitForm(event) {
    if (event) event.preventDefault()
    createModal(event)
    const modalBody = document.querySelector('#formModal .modal-body')
    modalBody.appendChild(visitForm.form)
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
        if (selected === 'Кардиолог') {
            cardiologistFields.hidden = false
            lastVisitField.hidden = true
            ageField.hidden = false
        }
        if (selected === 'Стоматолог') {
            cardiologistFields.hidden = true
            lastVisitField.hidden = false
            ageField.hidden = true
        }
        if (selected === 'Терапевт') {
            cardiologistFields.hidden = true
            lastVisitField.hidden = true
            ageField.hidden = false
        }
    }
}
function validateVisitForm() {
    const prioritySelect = document.querySelector('#create-visit .priority')
    if (prioritySelect.value === '* Срочность') {
        const warning = document.querySelector('#warning')
        if (warning) warning.remove() // проверка для того что бы поле "выбрать приоритет" добавлялось только одно
        visitForm.form.insertAdjacentHTML('beforeend', '<p id="warning" style="color: tomato"> Необходимо выбрать приоритет</p>')
        return false
    }

    const cardiologistGroup = document.querySelector('.cardiologist-group')
    if (cardiologistGroup.hidden) {
        const fields = document.querySelectorAll('#create-visit .form-control:not(.cardio)')
        if (!checkFields(fields)) return false
    } else {
        const fields = document.querySelectorAll('#create-visit .form-control')
        if (!checkFields(fields)) return false
    }

    function checkFields(fields) {
        for (let field of fields) {
            if (!field.hidden && field.value.trim() !== '') continue
            //  проверка пройдена ^
            else if (!field.hidden && field.tagName !== 'TEXTAREA') {
                visitForm.form.insertAdjacentHTML('beforeend', `<p class='warning'>Поля со звездочкой необходимы к заполнению</p>`)
                return false
            }
        }
    }

    const checkKeys = {
        name: document.querySelector('#create-visit .name').value,
        doctor: document.querySelector('#create-visit .doctors-list').value,
        title: document.querySelector('#create-visit .visit-goal').value,
        age: document.querySelector('#create-visit .age').value,
        priority: document.querySelector('#create-visit .priority').value,
        bp: document.querySelector('#create-visit .pressure').value,
        bmi: document.querySelector('#create-visit .body-weight').value,
        heartDiseases: document.querySelector('#create-visit .diseases').value,
        description: document.querySelector('#create-visit textarea').value,
        lastVisit: document.querySelector('#create-visit .last-visit').value,
        isClosed: false,
    }
    for (let key in checkKeys) {
        if (key === 'isClosed' || key === 'description') continue // trim выдаст ошибку если значением будет boolean.
        if (!checkKeys[key].trim()) {
            // удалаю ключи свойства которых равны пустой строке или пробелу.
            delete checkKeys[key]
        }
    }
    return checkKeys
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
        localStorage.setItem('autorizated', getToken)
        createVisitBtn.hidden = false
        loginBtn.hidden = true
        createVisitBtn.addEventListener('click', showVisitForm)
        // changeButton(loginBtn, 'Создать визит', 'create visit', '#formModal')
    } else {
        form.form.insertAdjacentHTML('beforeend', `<p style="color: tomato">Неверный логин или пароль</p>`)
    }
}

visitForm.form.addEventListener('submit', createVisit)
async function createVisit(event) {
    event.preventDefault()

    const requestBody = validateVisitForm()
    console.log(requestBody)
    if (!requestBody) return
    const token = localStorage.getItem('autorizated')
    const requestObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...requestBody }, null, '\t'),
    }
    const data = await visitForm.submit(event, DOMAIN, requestObj, 'JSON')
    visitForm.clear()
}
// async function get() {
//     const response = await fetch('https://ajax.test-danit.com/api/v2/cards', {
//         method: 'GET',
//         headers: {
//             Authorization: `Bearer d6fcc7cd-ddeb-40b8-9cde-465a6f4c5ea3`,
//         },
//     })
//     const d = await response.json()
//     console.log(d)
// }
// get()
