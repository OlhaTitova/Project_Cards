'use strict'
export { getItems, createVisit, chooseVisitForm, renderCard, createModal, createModalConfirm }

import { Modal, ModalConfirm } from './MODAL.js'
import { VisitTherapist, VisitCardiologist, VisitDentist } from './CARD.js'
import { CreateVisitForm } from './FORMS.js'
import { CARDIOLOGIST, DENTIST, THERAPIST, DOMAIN } from './CONSTS.js'

const itemsRow = document.querySelector('#items-row')

async function getItems() {
    const token = localStorage.getItem('autorizated')
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

async function createVisit() {
    let allItems = await getItems()

    itemsRow.innerHTML = ''

    allItems.forEach((item) => {
        const cell = document.createElement('div')
        cell.classList.add('col', 'mb-4')
        cell.setAttribute('id', `${item.id}`)
        cell.innerHTML = renderCard(chooseVisitForm(item))
        setListenersOnBtnCard(cell)
        itemsRow.appendChild(cell)
    })
    DragDrop()
}

function checkVisitStatus(item) {
    let res
    item.isClosed ? (res = 'закрыт') : (res = 'открыт')
    return res
}
function chooseVisitForm(item) {
    switch (item.doctor) {
        case THERAPIST:
            return new VisitTherapist(item.id, item.name, item.title, item.description, item.age, item.priority, checkVisitStatus(item))
        case CARDIOLOGIST:
            return new VisitCardiologist(item.id, item.name, item.title, item.description, item.age, item.bp, item.bmi, item.heartDiseases, item.priority, checkVisitStatus(item))
        case DENTIST:
            return new VisitDentist(item.id, item.name, item.title, item.description, item.lastVisit, item.priority, checkVisitStatus(item))
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
                    <p class="card-text">
                        <span class="text-secondary">Цель визита:</span>
                        <span class="visitor--visit-goal">${visit.title}</span>
                    </p>
                    <p class="card-text">
                        <span class="text-secondary">Приоритетность:</span>
                        <span class="visitor--priority">${visit.priority}</span>
                    </p>
                    <p class="card-text">
                        <span class="text-secondary">Состояние визита:</span>
                        <span class="visitor--status">${visit.isClosed}</span>
                    </p>
                    ${visit.renderVisit()}
                    <p class="card-text">
                        <span class="text-secondary">Описание визита:</span> 
                        <span class="visitor--description">${visit.description}</span>
                    </p>
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
    const token = localStorage.getItem('autorizated')
    const cardId = e.target.dataset.id
    const response = await fetch(`${DOMAIN}${cardId}`, {
        method: 'GET',
        headers: {
                Authorization: `Bearer ${token}`,
        },
    })
    
    let item = await response.json()
    $(document).ready(function () {
        $(`#${e.target.dataset.target.slice(1, Infinity)}`).modal('show')
    })
    const visitForm = new CreateVisitForm(item)
    const checkWrapper = visitForm.querySelector('.checkbox-wrapper')
    const checkBox = checkWrapper.querySelector('input[type="checkbox"]')
    checkWrapper.hidden = false
    checkBox.checked = item.isClosed
    
    const modalBody = createModal(e)
    modalBody.appendChild(visitForm)
    
    const closeBtn = visitForm.querySelector('.close-btn')
    closeBtn.addEventListener('click', closeChangeVisitForm)
    
    visitForm.addEventListener('submit', sendPUTRequest)
}
    
async function sendPUTRequest(e) {
    e.preventDefault()
    const token = localStorage.getItem('autorizated')
    const reqBody = {}
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
        setListenersOnBtnCard(target)
    }
}
        
function setListenersOnBtnCard(parentEl) {
    parentEl.querySelector('.btn-show-more').addEventListener('click', showMore)
    parentEl.querySelector('.btn-delete-card').addEventListener('click', createModalConfirm)
    parentEl.querySelector('.change-card').addEventListener('click', changeVisit)
}

function closeChangeVisitForm() {
    $('#formModal').modal('hide')
}

async function deleteVisit(event) {
    event.preventDefault()
    const token = localStorage.getItem('autorizated')
    const cardId = event.target.dataset.id
    
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

function createModal(e) {
    const btnValueDataTarget = e.target.dataset.target.slice(1, Infinity)
    let modal
    
    switch (btnValueDataTarget) {
        case 'formModal':
            modal = new Modal('formModal', 'Анкета')
            break
            
    case 'authorizationModal':
        modal = new Modal('authorizationModal', 'Авторизация')
        break
    }
    
    const wrapModal = document.querySelector('#wrap-modal')
    wrapModal.innerHTML = `
    <div class="modal fade" id="${modal.modalId}" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${modal.titleModal}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input id="visitId" type="text" hidden>
                </div>
            </div>
        </div>
    </div>
    `
    const modalBody = document.querySelector(`#${btnValueDataTarget} .modal-body`)
    return modalBody
}

function createModalConfirm(event) {
    const modalConfirm = new ModalConfirm('confirmModal', 'Удаление', 'Да, удалить визит', event.target.dataset.id)
    const wrapModalConfirm = document.querySelector('#wrap-modal')
    wrapModalConfirm.innerHTML = `
    <div class="modal fade" id="${modalConfirm.modalId}" tabindex="-1" role="dialog">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${modalConfirm.titleModal}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <input id="visitId" type="text" hidden>
                    ${modalConfirm.contentNode}
                </div>
            ${modalConfirm.contentFooter}
            </div>
        </div>
    </div>
    `
    const modal = document.querySelector('#confirmModal')
    const btnConfirm = modal.querySelector('[data-id]')
    btnConfirm.addEventListener('click', deleteVisit)
}

function DragDrop() {
    const cells = itemsRow.querySelectorAll('.col.mb-4')

    for (const el of cells) {
        el.draggable = true
    }

    itemsRow.addEventListener('dragstart', (e) => {
        e.target.closest('.col.mb-4').classList.add('drop-selected')
    })
    itemsRow.addEventListener('dragend', (e) => {
        e.target.closest('.col.mb-4').classList.remove('drop-selected')
    })
    itemsRow.addEventListener('dragover', (e) => {
        e.preventDefault()

        const activeElement = itemsRow.querySelector('.drop-selected')
        const currentElement = e.target.closest('.col.mb-4')
        const isMoveable = activeElement !== currentElement

        if (!currentElement) return
        if (!isMoveable) return

        const nextElement = getNextElement(e.clientY, currentElement)

        if ((nextElement && activeElement === nextElement.previousElementSibling) || activeElement === nextElement) {
            return
        }

        itemsRow.insertBefore(activeElement, nextElement)
    })

    const getNextElement = (cursorPosition, currentElement) => {
        const currentElementCoord = currentElement.getBoundingClientRect()
        const currentElementCenter = currentElementCoord.y + currentElementCoord.height / 2
        const nextElement = cursorPosition < currentElementCenter ? currentElement : currentElement.nextElementSibling

        return nextElement
    }
}