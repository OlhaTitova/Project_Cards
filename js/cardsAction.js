'use strict'

import { VisitTherapist, VisitCardiologist, VisitDentist } from './CARD.js'
import { createModal, createModalConfirm } from './createModal.js'
import { CreateVisitForm } from './FORMS.js'
import { CARDIOLOGIST, DENTIST, THERAPIST } from './CONSTS.js'

const DOMAIN = 'https://ajax.test-danit.com/api/v2/cards/'
// const token = checkSession()
const token = 'd6fcc7cd-ddeb-40b8-9cde-465a6f4c5ea3'
console.log(token)

export async function getItems() {
    console.log(token)
    const response = await fetch(`${DOMAIN}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    const items = await response.json()

    const noItemsMsg = document.querySelector('#no-items')
    items.length === 0 ? (noItemsMsg.hidden = false) : (noItemsMsg.hidden = true)

    return items
}
export async function createVisit() {
    let allItems = await getItems()

    const itemsRow = document.querySelector('#items-row')
    itemsRow.innerHTML = ''

    allItems.forEach((item) => {
        const col = document.createElement('div')
        col.classList.add('col', 'mb-4')
        col.setAttribute('id', `${item.id}`)
        col.innerHTML = renderCard(chooseVisitForm(item))
        setEditBtnCardListeners(col)

        itemsRow.appendChild(col)
    })
}
function checkVIsitStatus(item) {
    let res
    item.isClosed ? (res = 'закрыт') : (res = 'открыт')
    return res
}
function chooseVisitForm(item) {
    switch (item.doctor) {
        case THERAPIST:
            return new VisitTherapist(item.id, item.name, item.title, item.description, item.age, item.priority, checkVIsitStatus(item))
        case CARDIOLOGIST:
            return new VisitCardiologist(item.id, item.name, item.title, item.description, item.age, item.bp, item.bmi, item.heartDiseases, item.priority, checkVIsitStatus(item))
        case DENTIST:
            return new VisitDentist(item.id, item.name, item.title, item.description, item.lastVisit, item.priority, checkVIsitStatus(item))
        default:
            throw new Error('Undefined visit type')
    }
}

function renderCard(visit) {
    return `
    <div class="card border-info">
        <div class="card-body">
            <h5 class="card-title">${visit.name}</h5>
            <p class="card-text"><span class="text-secondary">Доктор:</span> ${visit.doctor}</p>
            <div class="text-show-more mb-3" hidden>
                <p class="card-text"><span class="text-secondary">Цель визита:</span> ${visit.title}</p>
                <p class="card-text"><span class="text-secondary">Приоритетность:</span> ${visit.priority}</p>
                <p class="card-text"><span class="text-secondary">Состояние визита:</span> ${visit.isClosed}</p>
                ${visit.renderVisit()}
                <p class="card-text"><span class="text-secondary">Описание визита:</span> ${visit.description}</p>
            </div>
        
            <button type="button" class="btn btn-info mb-3 btn-show-more">Показать больше</button>

            <div class="dropdown">
                <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenu2"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Редактировать
                </button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                    <button class="dropdown-item btn change-card" type="button" data-id="${visit.id}" data-target="#formModal">Редактировать</button>
                    <button class="dropdown-item btn btn-danger btn-delete-card" type="button" data-toggle="modal" data-target="#confirmModal" data-id="${visit.id}">Удалить</button>
                </div>
            </div>        
        </div>
    </div>
    `
}

async function changeVisit(e) {
    const cardId = e.target.dataset.id

    const response = await fetch(`${DOMAIN}${cardId}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    let item = await response.json()
    console.log(item)
    $(document).ready(function () {
        $(`#${e.target.dataset.target.slice(1, Infinity)}`).modal('show')
    })
    const visitForm = new CreateVisitForm(item)
    const checkWrapper = visitForm.querySelector('.checkbox-wrapper')
    const checkBox = checkWrapper.querySelector('input[type="checkbox"]')
    checkWrapper.hidden = false
    checkBox.checked = item.isClosed
    console.log(visitForm)

    const modalBody = createModal(e)
    modalBody.appendChild(visitForm)

    const closeBtn = visitForm.querySelector('.close-btn')
    closeBtn.addEventListener('click', closeChangeVisitForm)

    visitForm.addEventListener('submit', sendPUTRequest)
}

async function sendPUTRequest(e) {
    e.preventDefault()
    let reqBody = {}
    $(e.target)
        .serializeArray()
        .forEach((element) => {
            reqBody[element.name] = element.value
        })

    const checkBox = e.target.querySelector('input[type="checkbox"]')
    reqBody.isClosed = checkBox.checked

    const res = await fetch(`${DOMAIN}${reqBody.id}`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(reqBody),
    })
    if (res.status === 200) {
        closeChangeVisitForm()
        const target = document.getElementById(reqBody.id)
        target.innerHTML = renderCard(chooseVisitForm(reqBody))
        setEditBtnCardListeners(target)
    }
}

function setEditBtnCardListeners(parentEl) {
    parentEl.querySelector('.btn-show-more').addEventListener('click', showMore)
    parentEl.querySelector('.btn-delete-card').addEventListener('click', createModalConfirm)
    parentEl.querySelector('.change-card').addEventListener('click', changeVisit)
}

function closeChangeVisitForm() {
    $('#formModal').modal('hide')
}

export async function deleteVisit(event) {
    event.preventDefault()
    let cardId = event.target.dataset.id

    const res = await fetch(`${DOMAIN}${cardId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (res.status === 200) {
        document.body.querySelector(`[id="${event.target.dataset.id}"]`).remove()
        getItems()
    }
}

function showMore(e) {
    const blockShowMore = e.target.previousElementSibling
    if (blockShowMore.hidden) {
        blockShowMore.hidden = false
        e.target.textContent = 'Скрыть'
    } else {
        blockShowMore.hidden = true
        e.target.textContent = 'Показать больше'
    }
}