import {VisitTherapist, VisitCardiologist, VisitDentist} from './cardsClass.js';
import {Modal, ModalConfirm} from './modal.js';
export {createVisit};

async function getItems () {
    const response = await fetch('../json/data.json');
    const items = await response.json();
    return items;
}

async function createVisit(){
    
    let allItems = await getItems();
    const itemsRow = document.querySelector('#items-row');
    itemsRow.innerHTML = '';

    let visit;
    allItems.forEach((item) => {
        switch(item.doctor) {
            case 'therapist':
                visit = new VisitTherapist(item.name, item.title, item.description, item.age)
                break;

            case 'cardiologist':
                visit = new VisitCardiologist(item.name, item.title, item.description, item.age, item.bp, item.bmi, item.pd)
                break;

            case 'dentist':
                visit = new VisitDentist(item.name, item.title, item.description, item.data)
                break;
        }

        const col = document.createElement('div');
        col.classList.add('col', 'mb-4');
        col.innerHTML = `
            <div class="card border-info" id="${item.id}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text"><span class="text-secondary">Доктор:</span> ${item.doctor}</p>
                    <div class="text-show-more mb-3" hidden>
                        <p class="card-text"><span class="text-secondary">Цель визита:</span> ${item.title}</p>
                        <p class="card-text"><span class="text-secondary">Описание визита:</span> ${item.description}</p>
                        ${visit.renderVisit()}
                    </div>
                    <button type="button" class="btn btn-info mb-3 btn-show-more">Показать больше</button>
            
                    <div class="dropdown">
                        <button class="btn btn-info dropdown-toggle" type="button" id="dropdownMenu2"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Редактировать
                        </button>
                        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
                            <button class="dropdown-item btn change-card" type="button" data-id="${item.id}">Редактировать</button>
                            <button class="dropdown-item btn btn-danger btn-delete-card" type="button" data-toggle="modal" data-target="#confirmModal" data-id="${item.id}">Удалить</button>
                        </div>
                    </div>
            
                </div>
                </div>
        `;

        col.querySelector('.btn-show-more').addEventListener('click', showMore);
        col.querySelector('.btn-delete-card').addEventListener('click', showConfirmModal);
        // col.querySelector('.change-card').addEventListener('click', changeVizit);

        itemsRow.appendChild(col);
    });
}


const contentNodeConfirm = document.createElement('p');
contentNodeConfirm.innerText = 'Вы уверенны. что хотите удалить визит?';


function showConfirmModal(e) {
    e.preventDefault();
    const modalConfirm = new ModalConfirm('confirmModal', 'Удаление', "Да, удалить визит", contentNodeConfirm);
    // const modal = modalConfirm;
    // console.log(modalConfirm);
    const wrapModalConfirm = document.querySelector('#wrap-modal-confirm')
    wrapModalConfirm.append(modalConfirm);
};

const deleteVizit = $('#confirmModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) ;// Кнопка, запускающая модальное окно
    console.log(event, event.relatedTarget);
    var recipient = button.data('id') // Извлечь информацию из атрибутов data- *
    // При необходимости вы можете инициировать запрос AJAX здесь (а затем выполнить обновление в обратном вызове).
    // Обновляем содержимое модального окна. Здесь мы будем использовать jQuery, но вместо этого вы можете использовать библиотеку привязки данных или другие методы.
    var modal = $(this)
    modal.find('#confirm').data('whatever', recipient)
    modal.find('.modal-body p').text(recipient)
})



// async function deleteVizit(e) {


    //const btnConfirm = document.querySelector(`#${id}`);
    //console.log(btnConfirm);

    // btnConfirm.onclick()

// const sectionVisit = e.target.closest('.visits');

    // console.log(${dataset.id});deleteVizit
    // console.log(e.target.dataset.id)

    // const cardId = e.target.dataset.id;
    
    // const res = await fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
        //     method: 'DELETE',
        // headers: {
        //     Authorization: Bearer d6fcc7cd-ddeb-40b8-9cde-465a6f4c5ea3,
        //   },
        // });
        
        // if(res.status === 200) {


        // confirm('Вы уверенны, что хотите удалить визит?');

           // e.target.closest(`[id="${e.target.dataset.id}"]`).remove();
            // sectionVisit.querySelector(`[id="${sectionVisit.dataset.id}"]`).remove();
        

    // }
// }



//   async function changeVizit (e) {
    
    // const cardId = e.target.dataset.id;
    // const response = await fetch(``);
    // create Modal
    // const res = await fetch(`https://ajax.test-danit.com/api/cards/${cardId}`,
    // );
    // console.log(e.target.dataset.id); 
    // }
    
    
    // const modalForm = new Modal('formModal', 'Анкета');
    
    
    // function showFormModal(e) {
        //     e.preventDefault();
        //     const modal = modalForm;
        //     const wrapModalForm = document.querySelector('#wrap-modal-form')
        //     wrapModalForm.append(modal);
        // };

function showMore(e) {
    const blockShowMore = e.target.previousElementSibling;
    if(blockShowMore.hidden) {
        blockShowMore.hidden = false;
        e.target.textContent = "Скрыть";
    }else {
        blockShowMore.hidden = true;
        e.target.textContent = "Показать больше";
    }
}
 
const modalAuthorization = new Modal('authorizationModal', 'Авторизация');

const btnEntrance = document.querySelector('[data-target="#authorizationModal"]');
btnEntrance.addEventListener('click', showAuthorizationModal);


function showAuthorizationModal(e) {
    e.preventDefault();
    const modal = modalAuthorization;
    const wrapModalAuthorization = document.querySelector('#wrap-modal-authorization')
    wrapModalAuthorization.append(modal);
};