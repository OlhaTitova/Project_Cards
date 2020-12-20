'use strict';

import { Form, showFields } from './FORMS.js'
import { createModal } from './createModal.js'
import { createVisit } from './cardsAction.js'

const DOMAIN = 'https://ajax.test-danit.com/api/v2/cards'

const loginBtn = document.querySelector('[data-target="#authorizationModal"]')
const createVisitBtn = document.querySelector('[data-target="#formModal"]')
const visitForm = new Form('visit', 'create-visit')
const autorizationForm = new Form('autorization', 'autorization-form')

document.addEventListener('DOMContentLoaded', checkSession)
loginBtn.addEventListener('click', showAutorizationModal)
createVisitBtn.addEventListener('click', showVisitForm)
visitForm.form.addEventListener('submit', showApplication)

function checkSession() {
    const isAutorizated = localStorage.getItem('autorizated')
    if (isAutorizated) {
        loginBtn.hidden = true
        createVisitBtn.hidden = false
    }
}
function showAutorizationModal(event) {
    const modalBody = createModal(event)
    modalBody.append(autorizationForm.form)

    const submitBtn = document.querySelector('#autorization-form  button[type="submit"]')
    submitBtn.addEventListener('click', (event) => login(event, autorizationForm))
}

export function showVisitForm(event) {
    const modalBody = createModal(event)
    modalBody.appendChild(visitForm.form)

    const closeBtn = document.querySelector('#create-visit .close-btn')
    closeBtn.addEventListener('click', () => {
        visitForm.clear()
        $('#formModal').modal('hide') // Комментарий ниже внутри функции createVisit(event)
    })

    const doctors = document.querySelector('.doctors-list')
    doctors.addEventListener('change', () => showFields(document))
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
    } else {
        form.form.insertAdjacentHTML('beforeend', `<p style="color: tomato">Неверный логин или пароль</p>`)
    }
}

async function showApplication(event) {
    event.preventDefault()

    const requestBody = validateVisitForm()
    if (!requestBody) return
    const token = localStorage.getItem('autorizated')
    const requestObj = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody, null, '\t'),
    }
    const data = await visitForm.submit(event, DOMAIN, requestObj, 'JSON')
    visitForm.clear()

    createVisit();

    $('#formModal').modal('hide') // JQerry! Пришлось скрывать его принудительно, потому что если просто добавить аотрубит data-dismiss="modal" то при сабмите формы ДАННЫЕ НЕ ОТПРАВЛЯЮТСЯ НА СЕРВЕР и функция НЕ срабатывает, модальное окно ПРОСТО ИСЧЕЗАЕТ
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
