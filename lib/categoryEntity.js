const { v4 } = require("uuid");

class CategoryEntity {
  constructor(name,count,price) {
    this.id = v4();
    this.name = name;
    this.count=count;
    this.price=price
  }
  returnFnc(){
    return this.id
  }
}

module.exports = { CategoryEntity };
