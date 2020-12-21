'use strict'
export { showVisitForm, showFields, checkSession }

import { Form } from './FORMS.js'
import { createVisit, getItems, createModal } from './cardsAction.js'
import { DOMAIN, CARDIOLOGIST, DENTIST, THERAPIST } from './CONSTS.js'
import { deleteItem } from './filter.js'

const loginBtn = document.querySelector('[data-target="#authorizationModal"]')
const createVisitBtn = document.querySelector('[data-target="#formModal"]')
const autorizationForm = new Form('autorization', 'autorization-form')
const visitForm = new Form('visit', 'create-visit')

document.addEventListener('DOMContentLoaded', checkSession)
loginBtn.addEventListener('click', showAutorizationModal)
createVisitBtn.addEventListener('click', showVisitForm)
visitForm.form.addEventListener('submit', fillForm)

function checkSession() {
    const isAutorizated = localStorage.getItem('autorizated')
    if (isAutorizated) {
        loginBtn.hidden = true
        createVisitBtn.hidden = false
        createVisit()
    } else return false

    return isAutorizated
}
function showAutorizationModal(event) {
    const modalBody = createModal(event)
    modalBody.append(autorizationForm.form)

    const submitBtn = document.querySelector('#autorization-form  input[type="submit"]')
    submitBtn.addEventListener('click', (event) => login(event, autorizationForm))
}
function showVisitForm(event) {
    const modalBody = createModal(event)
    modalBody.appendChild(visitForm.form)

    const closeBtn = document.querySelector('#create-visit .close-btn')
    closeBtn.addEventListener('click', () => {
        visitForm.clear()
        $('#formModal').modal('hide')
    })

    const doctors = document.querySelector('.doctors-list')
    doctors.addEventListener('change', () => showFields(visitForm.form))
}
function validateVisitForm() {
    const prioritySelect = document.querySelector('#create-visit .priority')
    if (prioritySelect.value === '* Срочность') {
        deleteItem('#warning-priority')
        visitForm.form.insertAdjacentHTML('beforeend', '<p id="warning-priority" style="color: tomato"> Необходимо выбрать срочность</p>')
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
                deleteItem('#validate-warning')
                visitForm.form.insertAdjacentHTML('beforeend', `<p id="validate-warning" class='warning'>Поля со звездочкой необходимы к заполнению</p>`)
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
function showFields(form) {
    const doctors = form.querySelector('.doctors-list')
    const commonFields = form.querySelectorAll('.common')
    const cardiologistFields = form.querySelector('.cardiologist-group')
    const lastVisitField = form.querySelector('.last-visit')
    const ageField = form.querySelector('.age')
    const selected = doctors.value

    for (let field of commonFields) {
        field.hidden = false
    }
    if (selected === CARDIOLOGIST) {
        cardiologistFields.hidden = false
        lastVisitField.hidden = true
        ageField.hidden = false
    }
    if (selected === DENTIST) {
        cardiologistFields.hidden = true
        lastVisitField.hidden = false
        ageField.hidden = true
    }
    if (selected === THERAPIST) {
        cardiologistFields.hidden = true
        lastVisitField.hidden = true
        ageField.hidden = false
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
    const getToken = await form.submit(event, `${DOMAIN}login`, requestObj, 'TEXT')
    if (getToken) {
        localStorage.setItem('autorizated', getToken)
        checkSession()
    } else {
        form.form.insertAdjacentHTML('beforeend', `<p style="color: tomato">Неверный логин или пароль</p>`)
    }
}

async function fillForm(event) {
    event.preventDefault()

    const requestBody = validateVisitForm()
    if (!requestBody) return
    const token = checkSession()
    const requestObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody, null, '\t'),
    }
    await visitForm.submit(event, DOMAIN, requestObj, 'JSON')
    visitForm.clear()
    createVisit()
    getItems()
    $('#formModal').modal('hide')
}
