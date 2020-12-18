export {
    VisitTherapist,
    VisitCardiologist,
    VisitDentist
};

class Visit {
    constructor(name, doctor, title, description, priority, isClosed) {
        this.name = name;
        this.doctor = doctor;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.isClosed = isClosed;
    }
}

class VisitCardiologist extends Visit {
    constructor(name, title, description, age, bp, bmi, heartDiseases, priority, isClosed) {
        super(name, 'Кардиолог', title, description, priority, isClosed);
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

class VisitTherapist extends Visit {
    constructor(name, title, description, age, priority, isClosed) {
        super(name, 'Терапевт', title, description, priority, isClosed);
        this.age = age;
    }

    renderVisit() {
        return `<p class="card-text"><span class="text-secondary">Возраст:</span> ${this.age}</p>`;
    }
}

class VisitDentist extends Visit {
    constructor(name, title, description, lastVisit, priority, isClosed) {
        super(name, 'Стоматолог', title, description, priority, isClosed);
        this.lastVisit = lastVisit;
    }

    renderVisit() {
        return `<p class="card-text"><span class="text-secondary">Дата последнего визита:</span> ${this.lastVisit}</p>`;
    }
}