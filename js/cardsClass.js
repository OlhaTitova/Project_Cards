class Visit {
    constructor(name, doctor, title, description ){
        this.name = name;
        this.doctor = doctor;
        this.title = title;
        this.description = description;
    }
}

class  VisitCardiologist extends Visit {
    constructor(name, title, description, age, bp, bmi, pd) {
        super(name, 'cardiologist', title, description);
        this.age = age;
        this.bp = bp;
        this.bmi = bmi;
        this.pd = pd;
    }

    renderVisit () {
        return `        
            <p class="card-text"><span class="text-secondary">Возраст:</span> ${this.age}</p>
            <p class="card-text"><span class="text-secondary">Обычное давление:</span> ${this.bp}</p>
            <p class="card-text"><span class="text-secondary">Индекс массы тела:</span> ${this.bmi}</p>
            <p class="card-text"><span class="text-secondary">Перенесенные заболевания сердечно-сосудистой системы:</span> ${this.pd}</p>`;
            }
}

class VisitTherapist extends Visit {
    constructor(name, title, description, age) {
        super(name, 'therapist', title, description);
        this.age = age;
    }

    renderVisit () {
        return `<p class="card-text"><span class="text-secondary">Возраст:</span> ${this.age}</p>`;
    }
}

class VisitDentist extends Visit {
    constructor(name, title, description, data) {
        super(name, 'dentist', title, description);
        this.data = data;
    }

    renderVisit () {
        return  `<p class="card-text"><span class="text-secondary">Дата последнего визита:</span> ${this.data}</p>`;
            }
}

export { 
    VisitTherapist, 
    VisitCardiologist, 
    VisitDentist 
};



