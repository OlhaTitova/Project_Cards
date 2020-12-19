import { VisitTherapist, VisitCardiologist, VisitDentist } from './cardsClass.js'
import { Modal, ModalConfirm } from './modal.js'
export { createVisit }

const DOMAIN = 'https://ajax.test-danit.com/api/v2/cards/'
const token = 'd6fcc7cd-ddeb-40b8-9cde-465a6f4c5ea3'

async function getItems() {
    const response = await fetch(`${DOMAIN}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    const items = await response.json()
    return items
}
async function createVisit() {
    let allItems = await getItems()

    const itemsRow = document.querySelector('#items-row')
    itemsRow.innerHTML = ''

    let visit
    allItems.forEach((item) => {
        switch (item.doctor) {
            case 'Терапевт':
                visit = new VisitTherapist(item.name, item.title, item.description, item.age, item.priority, item.isClosed)
                break

            case 'Кардиолог':
                visit = new VisitCardiologist(item.name, item.title, item.description, item.age, item.bp, item.bmi, item.heartDiseases, item.priority, item.isClosed)
                break

            case 'Стоматолог':
                visit = new VisitDentist(item.name, item.title, item.description, item.lastVisit, item.priority, item.isClosed)
                break
        }

        if (item.isClosed) {
            item.isClosed = 'закрыт'
        } else {
            item.isClosed = 'открыт'
        }

        const col = document.createElement('div')
        col.classList.add('col', 'mb-4')
        col.innerHTML = `
                <div class="card border-info" id="${item.id}">
                    <div class="card-body">
                        <h5 class="card-title">${item.name}</h5>
                        <p class="card-text"><span class="text-secondary">Доктор:</span> ${item.doctor}</p>
                        <div class="text-show-more mb-3" hidden>
                            <p class="card-text"><span class="text-secondary">Цель визита:</span> ${item.title}</p>
                            <p class="card-text"><span class="text-secondary">Описание визита:</span> ${item.description}</p>
                            <p class="card-text"><span class="text-secondary">Приоритетность:</span> ${item.priority}</p>
                            <p class="card-text"><span class="text-secondary">Состояние визита:</span> ${item.isClosed}</p>
                            ${visit.renderVisit()}
                    
                            <div class="form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="isClosed">
                                <label class="form-check-label" for="isClosed">
                                    <span class="text-secondary">Закрыть визит</span>
                                </label>
                            </div>
                        </div>
                    
                        <button type="button" class="btn btn-info mb-3 btn-show-more">Показать больше</button>
            
                        <div class="dropdown">
                            <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenu2"
                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Редактировать
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                                <button class="dropdown-item btn change-card" type="button" data-id="${item.id}" data-toggle="modal" data-target="#formModal">Редактировать</button>
                                <button class="dropdown-item btn btn-danger btn-delete-card" type="button" data-toggle="modal" data-target="#confirmModal" data-id="${item.id}">Удалить</button>
                            </div>
                        </div>        
                    </div>
                </div>
                `

        col.querySelector('.btn-show-more').addEventListener('click', showMore)
        col.querySelector('.btn-delete-card').addEventListener('click', createModalConfirm)
        col.querySelector('.change-card').addEventListener('click', changeVisit)

        itemsRow.appendChild(col)
    })
}

async function changeVisit(e) {
    // const cardId = e.target.dataset.id;

    // const response = await fetch(`${DOMAIN}${cardId}`, {
    //     method: 'GET',
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //     }
    // });

    // let item = await response.json();
    // console.log(item);

    createModal(e)

    // вставить форму
    // вписать данные  item

    // const res = await fetch(`${DOMAIN}${cardId}`,
    //     {
    //         method: 'PUT',
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         body: JSON.stringify({ text })
    //     });

    //     if(res.status === 200) {
    //         // item = text;
    //     }
}

async function deleteVisit(event) {
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

// const btnEntrance = document.querySelector('[data-target="#authorizationModal"]');
// btnEntrance.addEventListener('click', createModal);

export function createModal(e) {
    // if (e) e.preventDefault()    а он нам тут точно нужен ?)

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
    return modalBody // Если нам в той функции нужно конкретно поле модал бади, мы можем его тут и возвращать сразу, а там не придется делать вызов и создаать переменную, а просто делаем так:
    // const modalBody = createModal(event)
    // modalBody.append(autorizationForm.form)
    // мне кажется так удобнее)
    // НО! Если тебе надо будет что бы эта функция возращала что-то другое, мы можем вернуть так как было когда вы пофиксили, или поставить условие, и в засимости от аргумента или еще чего то возвращать то что надо
}
