'use strict';

import {CARDIOLOGIST, DENTIST, THERAPIST} from './CONSTS.js';

class Visit {
    constructor(id, name, doctor, title, description, priority, isClosed) {
        this.name = name;
        this.doctor = doctor;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.isClosed = isClosed;
        this.id = id;
    }
}

export class VisitCardiologist extends Visit {
    constructor(id, name, title, description, age, bp, bmi, heartDiseases, priority, isClosed) {
        super(id, name, CARDIOLOGIST, title, description, priority, isClosed);
        this.age = age;
        this.bp = bp;
        this.bmi = bmi;
        this.heartDiseases = heartDiseases;
    }

    renderVisit() {
        return `        
            <p class="card-text"><span class="text-secondary">Возраст:</span> ${this.age}</p>
            <p class="card-text"><span class="text-secondary">Обычное давление:</span> ${this.bp}</p>
            <p class="card-text"><span class="text-secondary">Индекс массы тела:</span> ${this.bmi}</p>
            <p class="card-text"><span class="text-secondary">Перенесенные заболевания сердечно-сосудистой системы:</span> ${this.heartDiseases}</p>`;
    }
}

export class VisitTherapist extends Visit {
    constructor(id, name, title, description, age, priority, isClosed) {
        super(id, name, THERAPIST, title, description, priority, isClosed);
        this.age = age;
    }

    renderVisit() {
        return `<p class="card-text"><span class="text-secondary">Возраст:</span> ${this.age}</p>`;
    }
}

export class VisitDentist extends Visit {
    constructor(id, name, title, description, lastVisit, priority, isClosed) {
        super(id, name, DENTIST, title, description, priority, isClosed);
        this.lastVisit = lastVisit;
    }

    renderVisit() {
        return `<p class="card-text"><span class="text-secondary">Дата последнего визита:</span> ${this.lastVisit}</p>`;
    }
}