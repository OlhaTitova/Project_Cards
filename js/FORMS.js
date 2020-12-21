'use strict'

import { CARDIOLOGIST, DENTIST, THERAPIST } from './CONSTS.js'

class TextArea {
    constructor(name, rows = 1, classList, value) {
        const area = document.createElement('textarea')
        area.setAttribute('name', name)
        area.setAttribute('value', value)
        area.innerText = value
        area.classList = classList
        area.rows = rows
        return area
    }
}
class Input {
    constructor(type, name, classList, value, placeholder) {
        const input = document.createElement('input')
        input.type = type
        input.className = classList

        if (name) input.name = name
        if (placeholder) input.placeholder = placeholder
        if (value) input.setAttribute('value', value)
        return input
    }
}
class Button extends Input {
    constructor(type, name, classList, value, placeholder) {
        const button = super(type, name, classList, value, placeholder)
        button.type = type
        return button
    }
}

class Hidden extends Input {
    constructor(type, name, classList, value, placeholder) {
        const button = super(type, name, classList, value, placeholder)
        button.hidden = true

        return button
    }
}

class Select {
    constructor(name, defaultValue, options, data) {
        const select = document.createElement('select')
        select.setAttribute('name', name)
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

            if (data === optTag.value) {
                optTag.selected = true
            }
            select.appendChild(optTag)
        }
        return select
    }
}

class AutorizationForm {
    constructor() {
        const form = document.createElement('form')

        const inputLogin = new Input('email', null, 'form-control', null, 'example@gmail.com')
        const inputPassword = new Input('password', null, 'form-control', null, 'Пароль')
        const button = new Button('submit', null, 'btn btn-primary mt-4', 'Войти')
        button.setAttribute('data-dismiss', 'modal')

        form.append(inputLogin, inputPassword, button)
        return form
    }
}
class FilterForm {
    constructor() {
        const form = document.createElement('form')

        const searchInput = new Input('search', null, 'form-control', null, 'Поиск по заголовку или содержимому')
        searchInput.setAttribute('minlength', 3)

        const submit = new Input('submit', null, 'form-control', 'Поиск', null)
        const status = new Select('status', 'Статус визита', ['Все', 'Открыт', 'Закрыт'])
        const priority = new Select('priority', 'Срочность', ['Любая', 'Обычная', 'Приоритетная', 'Неотложная'])

        form.append(searchInput, status, priority, submit)
        return form
    }
}
export class CreateVisitForm {
    constructor(data) {
        const form = document.createElement('form')

        const createButton = new Button('submit', 'button', 'btn btn-primary send-btn mr-2 mt-4', 'Сохранить')
        const closeButton = new Button('button', 'button', 'btn btn-secondary close-btn mt-4', 'Закрыть')

        const doctors = new Select('doctor', 'Выберите врача', ['Кардиолог', 'Стоматолог', 'Терапевт'], data ? data.doctor : null)
        doctors.classList.add('doctors-list')

        const name = new Input('text', 'name', 'form-control common pop-up name', data ? data.name : null, '* ФИО')
        const age = new Input('number', 'age', 'form-control common pop-up age', data ? data.age : null, '* Возраст')
        const visitGoal = new Input('text', 'title', 'form-control common pop-up visit-goal', data ? data.title : null, '* Цель визита')

        const visitComment = new TextArea('description', 2, 'form-control common pop-up', data ? data.description : null, '')
        visitComment.placeholder = 'Комментарии'

        const priority = new Select('priority', '* Срочность', ['Обычная', 'Приоритетная', 'Неотложная'], data ? data.priority : null)
        priority.classList.add('common', 'pop-up', 'priority')

        const pressure = new Input('text', 'bp', 'form-control cardio pressure', data ? data.bp : null, '* Обычное давление')
        const bodyWeight = new Input('text', 'bmi', 'form-control cardio body-weight', data ? data.bmi : null, '* Индекс массы тела')
        const heartDiseases = new Input('text', 'heartDiseases', 'form-control cardio diseases', data ? data.heartDiseases : null, '* Болезни сердца')
        const cardiologistGroup = document.createElement('div')
        cardiologistGroup.className = 'cardiologist-group pop-up'
        cardiologistGroup.append(pressure, bodyWeight, heartDiseases)

        const lastVisit = new Input('text', 'lastVisit', 'form-control last-visit pop-up', data ? data.lastVisit : null, '* Последний визит')

        const checkBox = document.createElement('div')
        checkBox.className = 'checkbox-wrapper'
        checkBox.hidden = true
        checkBox.innerHTML = `<div class="form-check form-switch">
                                <input class="form-check-input" id="test" name="isClosed" checked="checked" type="checkbox" value="${data ? data.isClosed : null}">
                                <label class="form-check-label" for="test">
                                    <span class="text-secondary">Закрыть визит</span>
                                </label>
                            </div>`

        form.appendChild(new Hidden('text', 'id', '', data ? data.id : null))

        const fields = [doctors, name, visitGoal, age, priority, cardiologistGroup, lastVisit, visitComment, checkBox, createButton, closeButton]

        for (let field of fields) {
            form.appendChild(field)
            if (field.classList.contains('pop-up')) {
                field.hidden = true
            }
        }

        if (data) {
            showFields(form)
        }

        return form
    }
}

export class Form {
    id
    constructor(formType, formID) {
        this.form = this.create(formType)
        if (formID) this.id = this.form.id = formID
    }
    create(formType) {
        let form
        if (formType === 'autorization') form = new AutorizationForm()
        else if (formType === 'filter') form = new FilterForm()
        else if (formType === 'visit') form = new CreateVisitForm()
        else throw new Error('Incorrect form key.')
        return form
    }
    clear(event) {
        if (event) event.preventDefault()
        this.form.reset()
        const doctorsSelect = document.querySelector('.doctors-list')
        if (doctorsSelect) doctorsSelect.selectedIndex = 0

        const childrenToHide = document.querySelectorAll(`#${this.id} .pop-up`)
        if (childrenToHide.length !== 0) {
            for (let child of childrenToHide) {
                if (child.tagName === 'SELECT') {
                    child.selectedIndex = 0
                }
                child.hidden = true
            }
        }
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

export function showFields(form) {
    const doctors = form.querySelector('.doctors-list')
    const commonFields = form.querySelectorAll('.common')
    const cardiologistFields = form.querySelector('.cardiologist-group')
    const lastVisitField = form.querySelector('.last-visit')
    const ageField = form.querySelector('.age')
    const selected = doctors.value

    for (let field of commonFields) {
        field.hidden = false
    }
    if (selected === CARDIOLOGIST) {
        cardiologistFields.hidden = false
        lastVisitField.hidden = true
        ageField.hidden = false
    }
    if (selected === DENTIST) {
        cardiologistFields.hidden = true
        lastVisitField.hidden = false
        ageField.hidden = true
    }
    if (selected === THERAPIST) {
        cardiologistFields.hidden = true
        lastVisitField.hidden = true
        ageField.hidden = false
    }
}
