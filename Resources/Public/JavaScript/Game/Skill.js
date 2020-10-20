class Skill {
    constructor(result) {
        this.setCost(result.cost);
        this.setDeleted(result.deleted);
        this.setLevel(result.level);
        this.setName(result.name);
        this.setText(result.text);
        this.setTurns(result.turns);
        this.setType(result.type);
        this.setUid(result.uid);
        this.setValue(result.value);
    }
    setCost(cost) {
        this.cost = cost;
    }
    getCost() {
        return this.cost;
    }
    setDeleted(deleted) {
        this.deleted = deleted;
    }
    getDeleted() {
        return this.deleted;
    }
    setLevel(level) {
        this.level = level;
    }
    getLevel() {
        return this.level;
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setText(text) {
        this.text = text;
    }
    getText() {
        return this.text;
    }
    setTurns(turns) {
        this.turns = turns;
    }
    getTurns() {
        return this.turns;
    }
    setType(type) {
        this.type = type;
    }
    getType() {
        return this.type;
    }
    setUid(uid) {
        this.uid = uid;
    }
    getUid() {
        return this.uid;
    }
    setValue(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }

}
