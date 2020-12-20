'use strict';

export class Modal {
    contentFooter
    constructor(modalId, titleModal) {
        this.modalId = modalId
        this.titleModal = titleModal
    }
}

export class ModalConfirm extends Modal {
    constructor(modalId, titleModal, valueConfirm, visitId, contentNode) {
        super(modalId, titleModal, contentNode)

        this.contentFooter = `
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-dismiss="modal">Закрыть</button>
                <button type="button" class="btn btn-primary" data-dismiss="modal" data-id=${visitId}>Да, удалить визит</button>
            </div>`
        this.valueConfirm = valueConfirm
        this.contentNode = '<p>Вы уверенны, что хотите удалить визит?</p>'
    }
}