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

    const visitorName = document.querySelectorAll('.card-title')
    const visitorGoal = document.querySelectorAll('.visitor--visit-goal')
    const visitorPressure = document.querySelectorAll('.visitor--pressure')
    const visitorAge = document.querySelectorAll('.visitor--age')
    const visitorBMI = document.querySelectorAll('.visitor--bmi')
    const visitorDiseases = document.querySelectorAll('.visitor--heart-diseases')
    const visitorLastVisit = document.querySelectorAll('visitor--last-visit')
    const visitorPriority = document.querySelectorAll('.visitor--priority')
    const visitiorStatus = document.querySelectorAll('.visitor--status')

    const textFields = [...visitorName, ...visitorGoal, ...visitorPressure, ...visitorAge, ...visitorBMI, ...visitorDiseases, ...visitorLastVisit]
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
