export class Service {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    static fromObj(obj) {
        return new Service(obj.name, obj.description)
    }
}
