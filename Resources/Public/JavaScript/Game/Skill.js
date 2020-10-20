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
    /************************
     ******** Getter ********
     ************************/
    getUid() {
        return this.uid;
    }
    getCost() {
        return this.cost;
    }
    getDeleted() {
        return this.deleted;
    }
    getLevel() {
        return this.level;
    }
    getName() {
        return this.name;
    }
    getText() {
        return this.text;
    }
    getTurns() {
        return this.turns;
    }
    getType() {
        return this.type;
    }
    getValue() {
        return this.value;
    }
    /************************
     ******** Setter ********
     ************************/
    setUid(uid) {
        this.uid = uid;
    }
    setCost(cost) {
        this.cost = cost;
    }
    setDeleted(deleted) {
        this.deleted = deleted;
    }
    setLevel(level) {
        this.level = level;
    }
    setName(name) {
        this.name = name;
    }
    setText(text) {
        this.text = text;
    }
    setTurns(turns) {
        this.turns = turns;
    }
    setType(type) {
        this.type = type;
    }
    setValue(value) {
        this.value = value;
    }
}
