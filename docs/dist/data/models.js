export class Item {
    amount;
    name;
    constructor(amount, name) {
        this.amount = amount;
        this.name = name;
    }
}
export class Recipe {
    output;
    seconds;
    building;
    materials;
    constructor(output, seconds, building, materials) {
        this.output = output;
        this.seconds = seconds;
        this.building = building;
        this.materials = materials;
    }
}
//# sourceMappingURL=models.js.map