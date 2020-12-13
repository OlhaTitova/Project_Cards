class TextArea {
    constructor(rows = 1) {
        this.area = document.createElement('textarea')
        this.area.classList.add('form-control')
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

        this.visitGoal = new Input('text', 'form-control', null, 'Purpose of the visit')
        this.age = new Input('number', 'form-control', null, 'Enter your age')
        this.name = new Input('text', 'form-control', null, 'Name, Surename')
        this.visitComment = new TextArea()
        this.visitComment.placeholder = 'Short comment'
        this.priority = new Select('Priority', 'Low', 'Normal', 'High')
        this.commonFields = [this.name, this.visitGoal, this.age, this.visitComment, this.priority]

        this.pressure = new Input('text', 'form-control', null, 'Normal pressure')
        this.bodyWeight = new Input('text', 'form-control', null, 'body weight')
        this.heartDiseases = new Input('text', 'form-control', null, 'heart diseases')
        this.cardiologistFields = [this.pressure, this.bodyWeight, this.heartDiseases]
        this.lastVisit = new Input('text', 'form-control', null, 'dd.mm.yy')

        this.form.append(this.doctors)
        for (let field of this.commonFields) {
            this.form.appendChild(field)
            // field.hidden = true
        }
        for (let field of this.cardiologistFields) {
            this.form.appendChild(field)
        }
        this.form.append(this.lastVisit)
        this.form.append(this.createButton, this.closeButton)
        return this.form

        // кардиолог: обычное давление, вес тела,заболевания ссс
        // стоматолог: дата последнего посещения
        //цель визита, краткое описание, срочность, возвраст, фио
    }
}
const modal = document.querySelector('.modal-ne-bootstrap')
const test = new CreateVisitForm()
modal.appendChild(test)
