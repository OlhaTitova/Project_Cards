'use strict'

import { Form, showFields } from './FORMS.js'
import { createModal } from './createModal.js'
import { createVisit, getItems } from './cardsAction.js'
import { checkSession, createVisitBtn, loginBtn } from './main.js'
const DOMAIN = 'https://ajax.test-danit.com/api/v2/cards'

const autorizationForm = new Form('autorization', 'autorization-form')
const visitForm = new Form('visit', 'create-visit')

loginBtn.addEventListener('click', showAutorizationModal)
createVisitBtn.addEventListener('click', showVisitForm)
visitForm.form.addEventListener('submit', fillForm)

function showAutorizationModal(event) {
    const modalBody = createModal(event)
    modalBody.append(autorizationForm.form)

    const submitBtn = document.querySelector('#autorization-form  input[type="submit"]')
    submitBtn.addEventListener('click', (event) => login(event, autorizationForm))
}

export function showVisitForm(event) {
    const modalBody = createModal(event)
    modalBody.appendChild(visitForm.form)

    const closeBtn = document.querySelector('#create-visit .close-btn')
    closeBtn.addEventListener('click', () => {
        visitForm.clear()
        $('#formModal').modal('hide')
    })

    const doctors = document.querySelector('.doctors-list')
    doctors.addEventListener('change', () => showFields(document))
    doctors.addEventListener('change', () => showFields(visitForm.form))
}
function validateVisitForm() {
    const prioritySelect = document.querySelector('#create-visit .priority')
    if (prioritySelect.value === '* Срочность') {
        const warning = document.querySelector('#warning')
        if (warning) warning.remove() // проверка для того что бы поле "выбрать приоритет" добавлялось только одно
        visitForm.form.insertAdjacentHTML('beforeend', '<p id="warning" style="color: tomato"> Необходимо выбрать срочность</p>')
        return false
    }

    const cardiologistGroup = document.querySelector('.cardiologist-group')
    let fields

    if (cardiologistGroup.hidden) {
        fields = document.querySelectorAll('#create-visit .form-control:not(.cardio)')
    } else {
        fields = document.querySelectorAll('#create-visit .form-control')
    }

    if (!checkFields(fields)) return false

    function checkFields(fields) {
        for (let field of fields) {
            if (field.tagName === 'CHECKBOX') continue
            if (!field.hidden && field.value.trim() !== '') continue
            //  проверка пройдена ^
            else if (!field.hidden && field.tagName !== 'TEXTAREA') {
                visitForm.form.insertAdjacentHTML('beforeend', `<p class='warning'>Поля со звездочкой необходимы к заполнению</p>`)
                return false
            }
        }
        return true
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
        if (key === 'isClosed' || key === 'description') continue
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
        checkSession()
        // createVisit()
    } else {
        form.form.insertAdjacentHTML('beforeend', `<p style="color: tomato">Неверный логин или пароль</p>`)
    }
}

async function fillForm(event) {
    event.preventDefault()

    const requestBody = validateVisitForm()
    if (!requestBody) return
    // const token = localStorage.getItem('autorizated')
    const token = checkSession()
    const requestObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody, null, '\t'),
    }
    console.log(requestObj.body)
    const data = await visitForm.submit(event, DOMAIN, requestObj, 'JSON')
    console.log(data)
    visitForm.clear()
    createVisit()
    getItems()
    $('#formModal').modal('hide')
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
