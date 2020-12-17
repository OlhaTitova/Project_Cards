export {ModalConfirm}

class Modal {
    contentFooter;
    constructor(modalId, titleModal, contentNode) {

        this.modalId = modalId;
        this.titleModal = titleModal;
        this.contentNode = contentNode;
    }
}

class ModalConfirm extends Modal {
    constructor(modalId, titleModal, valueConfirm, visitId, contentNode){
    super(modalId, titleModal, contentNode);

    this.contentFooter = `
    <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
        <button type="button" class="btn btn-primary" data-dismiss="modal" data-id=${visitId}>Да, удалить визит</button>
    </div>`;

    this.valueConfirm = valueConfirm;

    this.contentNode = '<p>Вы уверенны, что хотите удалить визит?</p>'
    }
}

const btnEntrance = document.querySelector('[data-target="#authorizationModal"]');
btnEntrance.addEventListener('click', createModal);


function createModal(){
    
    const contentNode = 'Привет';

    const modalAuthorization = new Modal('authorizationModal', 'Авторизация', contentNode);
    // console.log(modalConfirm.modalId);
    const wrapModalConfirm = document.querySelector('#wrap-modal')
    wrapModalConfirm.innerHTML = `
    <div class="modal fade" id="${modalAuthorization.modalId}" tabindex="-1" role="dialog">
         <div class="modal-dialog">
           <div class="modal-content">
             <div class="modal-header">
               <h5 class="modal-title" id="exampleModalLabel">${modalAuthorization.titleModal}</h5>
               <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div class="modal-body">
             <input id="visitId" type="text" hidden>
               ${modalAuthorization.contentNode}
             </div>
           </div>
         </div>
    </div>
    `;   
}


