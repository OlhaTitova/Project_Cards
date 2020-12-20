'use strict';

import {deleteVisit} from './cardsAction.js'
import {Modal, ModalConfirm} from './MODAL.js';

export function createModal(e) {

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


export function createModalConfirm(event) {
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
