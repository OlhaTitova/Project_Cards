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
    if (status.selectedIndex === 0 || priority.selectedIndex === 0) {
        showWarning(filterForm.form, 'Необходимо выбрать срочность и приоритет.', '#filter-check')
        return
    }
    deleteItem('#filter-check')

    const cards = document.querySelectorAll('.col.mb-4')
    for (let card of cards) {
        if (searchInputValue === '' && status.value === 'Все' && priority.value === 'Любая') {
            card.classList.remove('display-none')
            continue
        }

        const temp = [
            getElemText(card, '.card-title'),
            getElemText(card, '.visitor--visit-goal'),
            getElemText(card, '.visitor--pressure'),
            getElemText(card, '.visitor--age'),
            getElemText(card, '.visitor--bmi'),
            getElemText(card, '.visitor--heart-diseases'),
            getElemText(card, '.visitor--last-visit'),
        ]
        let str = temp.join('').toLowerCase()

        const visitorPriority = card.querySelector('.visitor--priority').textContent.toLowerCase()
        const visitiorStatus = card.querySelector('.visitor--status').textContent.toLowerCase()

        if (!str.includes(searchInputValue.toLowerCase())) {
            card.classList.add('display-none')
        } else if (card.classList.contains('display-none')) {
            card.classList.remove('display-none')
        }

        if (status.value !== 'Все') {
            if (status.value.toLowerCase() !== visitiorStatus) {
                card.classList.add('display-none')
            }
        }
        if (priority.value !== 'Любая') {
            if (priority.value.toLowerCase() !== visitorPriority) {
                card.classList.add('display-none')
            }
        }
    }
}

function getElemText(parentEl, selctor) {
    const element = parentEl.querySelector(selctor)
    if (element) return element.textContent
    else return ''
}
function showWarning(parentEl, string, selector) {
    const pereviousWarning = document.querySelector(selector)
    if (pereviousWarning) return
    return parentEl.insertAdjacentHTML('beforeend', `<p id="filter-check" class="warning">${string}</p>`)
}
function deleteItem(selector) {
    const itemToremove = document.querySelector(selector)
    itemToremove ? itemToremove.remove() : null
}
