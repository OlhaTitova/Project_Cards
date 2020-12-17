export {Modal, ModalConfirm}

class Modal {
    constructor(divModal, modalId, titleModal, contentNode) {

        this.modalId = modalId;
        this.titleModal = titleModal;
        this.contentNode = contentNode;
        
        divModal = document.createElement('div');
        console.log(divModal);
        this.divModal = document.createElement('div');
        console.log(this.divModal);



        // const divDialog = document.createElement('div');
        // const divContent = document.createElement('div');
        // const divHeader = document.createElement('div');
        // const modalTitle = document.createElement('h5');
        // const btnClose = document.createElement('button');
        // const x = document.createElement('span');
        // const divBody = document.createElement('div');
        // const divFooter = document.createElement('div');

        
        // divModal.className = 'modal';
        // divModal.setAttribute('id', modalId);
        // divModal.setAttribute('tabindex', '-1');
        // divModal.setAttribute('role', 'dialog');

        // divDialog.className = 'modal-dialog';

        // divContent.className = 'modal-content';

        // divHeader.className = 'modal-header';

        // modalTitle.className = 'modal-title';
        // modalTitle.innerText = titleModal;

        // btnClose.className = close;
        // btnClose.setAttribute('type', 'button');
        // btnClose.setAttribute('data-dismiss', 'modal');
        // btnClose.setAttribute('aria-label', 'buClosetton');

        // x.setAttribute('aria-hidden', "true");
        // x.innerHTML = "&times;"

        // divBody.className = 'modal-body';

        // divHeader.appendChild(modalTitle);
        // btnClose.appendChild(x);
        // divHeader.appendChild(btnClose);
        // divBody.append(contentNode);
        // divContent.appendChild(divHeader);
        // divContent.appendChild(divBody);
        // divContent.appendChild(divFooter);
        // divDialog.appendChild(divContent);
        // divModal.appendChild(divDialog);

        return divModal
    }
}

class ModalConfirm extends Modal {
    constructor(divModal, modalId, titleModal, valueConfirm, contentNode){
    super(divModal, modalId, titleModal, contentNode);

    this.valueConfirm = valueConfirm;

    // const divContent = document.createElement('div');
    // const divFooter = document.createElement('div');
    // const btnReject = document.createElement('button');
    // const btnConfirm = document.createElement('button');

    // divFooter.className = 'modal-footer';

    // btnReject.className = 'btn btn-secondary';
    // btnReject.setAttribute('type', 'button');
    // btnReject.setAttribute('data-dismiss', 'modal');
    // btnReject.innerText = "Закрыть";

    // btnConfirm.className = 'btn btn-primary';
    // btnConfirm.setAttribute('type', 'submit');
    // btnConfirm.innerText = valueConfirm;

    // divFooter.appendChild(btnReject);
    // divFooter.appendChild(btnConfirm);
    // divContent.appendChild(divFooter);

    // console.log(divModal);
    console.log(this.divModal);

    // return divModal
    }
}