import {VisitTherapist, VisitCardiologist, VisitDentist} from './cardsClass.js';
import {ModalConfirm} from './modal.js';
export {createVisit};

const DOMAIN = 'https://ajax.test-danit.com/api/v2/cards';
const token = 'd6fcc7cd-ddeb-40b8-9cde-465a6f4c5ea3';

async function getItems () {
    const response = await fetch(DOMAIN, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
    }});

    const items = await response.json();
    console.log(items);
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
        col.querySelector('.btn-delete-card').addEventListener('click', createModalConfirm);
        // col.querySelector('.change-card').addEventListener('click', changeVizit);

        itemsRow.appendChild(col);
    });
}


//   async function changeVizit (e) {
    
    // const cardId = e.target.dataset.id;
    // const response = await fetch(``);
    // create Modal
    // const res = await fetch(`https://ajax.test-danit.com/api/cards/${cardId}`,
    // );
    // console.log(e.target.dataset.id); 
    // }
    


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
 
function createModalConfirm(event){
    // console.log(event.target);
    const modalConfirm = new ModalConfirm('confirmModal', 'Удаление', "Да, удалить визит", event.target.dataset.id);
    // console.log(modalConfirm.modalId);
    const wrapModalConfirm = document.querySelector('#wrap-modal');
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
    `;   

    const modal = document.querySelector('#confirmModal');
    const btnConfirm = modal.querySelector('[data-id]');
    btnConfirm.addEventListener('click', deleteVisit);
}

async function deleteVisit(event) {

    event.preventDefault();

    // let cardId = event.target.dataset.id;
    // token = 'd6fcc7cd-ddeb-40b8-9cde-465a6f4c5ea3';

    // const res = await fetch(`https://ajax.test-danit.com/api/v2/cards/${cardId}`, {
    //         method: 'DELETE',
    //     headers: {
    //         'Authorization': `Bearer ${token}`,
    //       },
    //     });
        
        // if(res.status === 200) {

           document.body.querySelector(`[id="${event.target.dataset.id}"]`).remove(); 
// }
}
