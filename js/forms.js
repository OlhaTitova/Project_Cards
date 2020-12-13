class TextArea {
    constructor(rows = 1, classList) {
        this.area = document.createElement('textarea')
        this.area.classList = classList
        this.area.rows = rows
        return this.area
    }
}
class Input {
    constructor(type, classList, value, placeholder) {
        this.input = document.createElement('input')
        this.input.classList = classList
        this.input.type = type
        if (value) this.input.value = value
        if (placeholder) this.input.placeholder = placeholder
        return this.input
    }
}
class Select {
    constructor(defaultValue, ...options) {
        this.select = document.createElement('select')
        this.select.classList.add('form-select')

        this.default = document.createElement('option')
        this.default.innerText = defaultValue
        this.default.disabled = true
        this.default.selected = true
        this.select.appendChild(this.default)

        for (let opt of options) {
            const optTag = document.createElement('option')
            optTag.value = opt
            optTag.innerText = opt
            this.select.appendChild(optTag)
        }
        return this.select
    }
}

class AutorizationForm {
    constructor() {
        this.form = document.createElement('form')

        this.button = new Input('button', 'btn btn-info', 'Login')
        this.inputLogin = new Input('email', 'form-control', null, 'example@gmail.com')
        this.inputPassword = new Input('password', 'form-control', null, 'Password')

        this.form.append(this.inputLogin, this.inputPassword, this.button)
        return this.form
    }
}
class FilterForm {
    constructor() {
        this.form = document.createElement('form')

        this.searchInput = new Input('text', 'form-control', null, 'Search by header or content')
        this.status = new Select('Visits', 'All', 'Open', 'Done')
        this.priority = new Select('Priority', 'None', 'Low', 'Normal', 'High')

        this.form.append(this.searchInput, this.status, this.priority)
        return this.form
    }
}
class CreateVisitForm {
    constructor() {
        this.form = document.createElement('form')

        this.createButton = new Input('submit', 'btn btn-success', 'Create')
        this.closeButton = new Input('button', 'btn btn-secondary btn-sm', 'Close')
        this.doctors = new Select('Choose a Doctor', 'Cardiologist', 'Dentist', 'Therapist')
        this.doctors.classList.add('doctors-list')

        this.visitGoal = new Input('text', 'form-control common pop-up', null, 'Purpose of the visit')
        this.age = new Input('number', 'form-control common pop-up', null, 'Enter your age')
        this.name = new Input('text', 'form-control common pop-up', null, 'Name, Surename')

        this.visitComment = new TextArea(1, 'form-control common pop-up')
        this.visitComment.placeholder = 'Short comment'

        this.priority = new Select('Priority', 'Low', 'Normal', 'High')
        this.priority.classList += ' common pop-up'

        this.pressure = new Input('text', 'form-control cardiologist pop-up', null, 'Normal pressure')
        this.bodyWeight = new Input('text', 'form-control cardiologist pop-up', null, 'body weight')
        this.heartDiseases = new Input('text', 'form-control cardiologist pop-up', null, 'heart diseases')

        this.lastVisit = new Input('text', 'form-control dentist pop-up', null, 'dd.mm.yy')

        this.fields = [
            this.doctors,
            this.name,
            this.visitGoal,
            this.age,
            this.priority,
            this.pressure,
            this.bodyWeight,
            this.heartDiseases,
            this.lastVisit,
            this.visitComment,
            this.createButton,
            this.closeButton,
        ]

        for (let field of this.fields) {
            this.form.appendChild(field)
            if (field.classList.contains('pop-up')) {
                field.hidden = true
            }
        }
        return this.form

        // кардиолог: обычное давление, вес тела,заболевания ссс
        // стоматолог: дата последнего посещения
        //цель визита, краткое описание, срочность, возвраст, фио
    }
}
const modal = document.querySelector('.modal-ne-bootstrap')
const test = new CreateVisitForm()
modal.appendChild(test)

const doctors = document.querySelector('.doctors-list')
doctors.addEventListener('change', showFields)
function showFields(e) {
    const commonFields = document.querySelectorAll('.pop-up.common')
    for (field of commonFields) {
        field.hidden = false
    }
    const selected = doctors.value
    if (selected === 'Cardiologist') {
        const cardiologistFields = document.querySelectorAll('.pop-up.cardiologist')
        for (let field of cardiologistFields) {
            field.hidden = false
        }
    }
}
