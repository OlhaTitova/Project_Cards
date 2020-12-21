import { Form } from './FORMS.js'
const filterForm = new Form('filter', 'filter-form')
const filterWrapper = document.querySelector('#filter-wrapper')

filterWrapper.append(filterForm.form)
filterForm.form.addEventListener('submit', showFilteredCards)
async function showFilteredCards(event) {
    event.preventDefault()
    const searchInputValue = document.querySelector('#filter-form input[type="search"]').value
    const status = document.querySelector('#filter-form select[name="status"]')
    const priority = document.querySelector('#filter-form select[name="priority"]')
    // if (status.selectedIndex === 0 || priority.selectedIndex === 0) {
    //     showWarning(filterForm.form, 'Необходимо выбрать срочность и приоритет.', '#filter-check')
    //     return
    // }
    // deleteItem('#filter-check')

    const cards = document.querySelectorAll('.col.mb-4')
    for (let card of cards) {
        if (searchInputValue === '') {
            card.classList.remove('display-none')
            continue
        }

        const temp = [
            findElem(card, '.card-title'),
            findElem(card, '.visitor--visit-goal'),
            findElem(card, '.visitor--pressure'),
            findElem(card, '.visitor--age'),
            findElem(card, '.visitor--bmi'),
            findElem(card, '.visitor--heart-diseases'),
            findElem(card, '.visitor--last-visit'),
        ]
        let str = ''

        for (let item of temp) {
            if (item.textContent) str += item.textContent
        }
        if (!str.includes(searchInputValue)) card.classList.add('display-none')
        else if (card.classList.contains('display-none')) card.classList.remove('display-none')
    }

    const visitorPriority = document.querySelectorAll('.visitor--priority')
    const visitiorStatus = document.querySelectorAll('.visitor--status')
}
function findElem(parentEl, selctor) {
    const element = parentEl.querySelector(selctor)
    if (element) return element
    else return ''
}
// function showWarning(parentEl, string, selector, boolean) {
//     const pereviousWarning = document.querySelector(selector)
//     if (pereviousWarning) return
//     return parentEl.insertAdjacentHTML('beforeend', `<p id="filter-check" class="warning">${string}</p>`)
// }
// function deleteItem(selector) {
//     const itemToremove = document.querySelector(selector)
//     itemToremove ? itemToremove.remove() : null
// }
