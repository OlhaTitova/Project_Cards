'use strict';

import {CARDIOLOGIST, DENTIST, THERAPIST} from './CONSTS.js';

class TextArea {
    constructor(name, rows = 1, classList) {
        const area = document.createElement('textarea')
        area.setAttribute('name', name);
        area.classList = classList
        area.rows = rows
        return area
    }
}
class Input {
    constructor(name, classes, value, placeholder) {
        const input = document.createElement('input')
        input.className = classes
        input.setAttribute('type', 'text')
        input.setAttribute('name', name)
        if (value) input.setAttribute('value', value)
        if (placeholder) input.setAttribute('placeholder', placeholder)
        return input
    }
}

class Button extends Input {
    constructor(type, classes, value, placeholder) {
        const button = super(type, classes, value, placeholder)
        button.setAttribute('type', type)
       
        return button
    }
}

class Hidden extends Input {
    constructor(type, classes, value, placeholder) {
        const button = super(type, classes, value, placeholder)
        button.hidden = true
       
        return button
    }
}

class Select {
    constructor(name, placeholder, options, data) {
        const select = document.createElement('select')
        select.setAttribute('name', name);
        select.classList.add('form-control')

        const defaultOption = document.createElement('option')
        defaultOption.innerText = placeholder
        defaultOption.disabled = true
        defaultOption.setAttribute('selected', true);
        select.appendChild(defaultOption)

        for (let opt of options) {
            const optTag = document.createElement('option')
            optTag.value = opt
            if(data == optTag.value) {
                optTag.setAttribute('selected', true);
            }
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
        const button = new Button('submit', 'btn btn-info', 'Войти')
        button.setAttribute('data-dismiss', 'modal')

        form.append(inputLogin, inputPassword, button)
        return form
    }
}
class FilterForm {
    constructor() {
        const form = document.createElement('form')

        const searchInput = new Input('search', 'form-control', null, 'Поиск по заголовку или содержимому')
        const status = new Select('Визиты', ['Все', 'Открытые', 'Зыкрытые'])
        const priority = new Select('Срочность', 'Нет', ['Обычная', 'Приоритетная', 'Неотложная'])

        form.append(searchInput, status, priority)
        return form
    }
}
export class CreateVisitForm {
    constructor(data) {
        const form = document.createElement('form')

        const createButton = new Button('submit', 'btn btn-success send-btn', 'Создать')
        const closeButton = new Button('button', 'btn btn-secondary close-btn', 'Закрыть')

        const doctors = new Select('doctor', 'Выберите врача', ['Кардиолог', 'Стоматолог', 'Терапевт'], data ? data.doctor : null)
        doctors.classList.add('doctors-list')

        const name = new Input('name', 'form-control common pop-up name', data ? data.name : null, '* ФИО')
        const age = new Input('age', 'form-control common pop-up age', data ? data.age : null, '* Возвраст')
        const visitGoal = new Input('title', 'form-control common pop-up visit-goal', data ? data.title : null, '* Цель визита')

        const visitComment = new TextArea('destination', 2, 'form-control common pop-up', data ? data.destination : null)
        visitComment.placeholder = 'Комментарии'

        const priority = new Select('priority', '* Срочность', ['Обычная', 'Приоритетная', 'Неотложная'], data ? data.priority : null)
        priority.classList.add('common', 'pop-up', 'priority')

        const pressure = new Input('bp', 'form-control cardio pressure', data ? data.bp : null, '* Обычное давление')
        const bodyWeight = new Input('bmi', 'form-control cardio body-weight', data ? data.bmi : null, '* Индекс массы тела')
        const heartDiseases = new Input('heartDiseases', 'form-control cardio diseases', data ? data.heartDiseases : null, '* Болезни сердца')
        const cardiologistGroup = document.createElement('div')
        cardiologistGroup.className = 'cardiologist-group pop-up'
        cardiologistGroup.append(pressure, bodyWeight, heartDiseases)

        const lastVisit = new Input('lastVisit', 'form-control last-visit pop-up', data ? data.lastVisit : null, '* Последний визит')

        form.appendChild(new Hidden('id', '', data ? data.id : null))

        const fields = [doctors, name, visitGoal, age, priority, cardiologistGroup, lastVisit, visitComment, createButton, closeButton]

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
        let form;
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
