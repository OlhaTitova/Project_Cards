export { Form }
class TextArea {
    constructor(rows = 1, classList) {
        const area = document.createElement('textarea')
        area.classList = classList
        area.rows = rows
        return area
    }
}
class Input {
    constructor(type, classList, value, placeholder) {
        const input = document.createElement('input')
        input.classList = classList
        input.type = type
        if (value) input.value = value
        if (placeholder) input.placeholder = placeholder
        return input
    }
}
class Select {
    constructor(defaultValue, ...options) {
        const select = document.createElement('select')
        select.classList.add('form-control')

        const defaultOption = document.createElement('option')
        defaultOption.innerText = defaultValue
        defaultOption.disabled = true
        defaultOption.selected = true
        select.appendChild(defaultOption)

        for (let opt of options) {
            const optTag = document.createElement('option')
            optTag.value = opt
            optTag.innerText = opt
            select.appendChild(optTag)
        }
        return select
    }
}

class AutorizationForm {
    constructor() {
        const form = document.createElement('form')

        const inputLogin = new Input('email', 'form-control', null, 'example@gmail.com')
        const inputPassword = new Input('password', 'form-control', null, 'Пароль')
        const button = new Input('submit', 'btn btn-info', 'Войти')

        form.append(inputLogin, inputPassword, button)
        return form
    }
}
class FilterForm {
    constructor() {
        const form = document.createElement('form')

        const searchInput = new Input('search', 'form-control', null, 'Поиск по заголовку или содержимому')
        const status = new Select('Визиты', 'Все', 'Открытые', 'Зыкрытые')
        const priority = new Select('Срочность', 'Нет', 'Обычная', 'Приоритетная', 'Неотложная')

        form.append(searchInput, status, priority)
        return form
    }
}
class CreateVisitForm {
    constructor() {
        const form = document.createElement('form')

        const createButton = new Input('submit', 'btn btn-success', 'Создать')
        const closeButton = new Input('button', 'btn btn-secondary btn-sm', 'Закрыть')
        const doctors = new Select('Выберите врача', 'Кардиолог', 'Стоматолог', 'Терапевт')
        doctors.classList += ' doctors-list'

        const name = new Input('text', 'form-control common pop-up name', null, '* ФИО')
        const age = new Input('number', 'form-control common pop-up age', null, '* Возвраст')
        const visitGoal = new Input('text', 'form-control common pop-up visit-goal', null, '* Цель визита')

        const visitComment = new TextArea(2, 'form-control common pop-up')
        visitComment.placeholder = 'Комментарии'

        const priority = new Select('* Срочность', 'Обычная', 'Приоритетная', 'Неотложная')
        priority.classList += ' common pop-up priority'

        const pressure = new Input('text', 'form-control cardio pressure', null, '* Обычное давление')
        const bodyWeight = new Input('text', 'form-control cardio body-weight', null, '* Индекс массы тела')
        const heartDiseases = new Input('text', 'form-control cardio diseases', null, '* Болезни сердца')
        const cardiologistGroup = document.createElement('div')
        cardiologistGroup.classList = 'cardiologist-group pop-up'
        cardiologistGroup.append(pressure, bodyWeight, heartDiseases)

        const lastVisit = new Input('text', 'form-control last-visit pop-up', null, '* Последний визит')

        const fields = [doctors, name, visitGoal, age, priority, cardiologistGroup, lastVisit, visitComment, createButton, closeButton]

        for (let field of fields) {
            form.appendChild(field)
            if (field.classList.contains('pop-up')) {
                field.hidden = true
            }
        }
        return form
    }
}

class Form {
    constructor(formType, formID) {
        this.form = this.create(formType)
        if (formID) this.form.id = formID
    }
    create(formType) {
        if (formType === 'autorization') this.form = new AutorizationForm()
        else if (formType === 'filter') this.form = new FilterForm()
        else if (formType === 'visit') this.form = new CreateVisitForm()
        else throw new Error('Incorrect form key.')
        return this.form
    }
    clear(event) {
        if (event) event.preventDefault()
        this.form.reset()
    }
    async submit(event, destination, obj, transformMethod) {
        event.preventDefault()
        const response = await fetch(destination, obj)
        if (response.status < 300) {
            if (transformMethod === 'JSON') return await response.json()
            if (transformMethod === 'TEXT') return await response.text()
        } else return false
    }
}
