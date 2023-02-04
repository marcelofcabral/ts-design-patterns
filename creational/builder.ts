// The builder design pattern allows the construction of complex objects in a step-by-step manner.
// It is especially useful when constructing complex objects that have a varying number of fields using the same constructor.

// our products: pizzas and sandwiches. The value for each field will be assigned in the build steps of the builders.
class Pizza {
  flour: string;
  topping: string;
  cheese: string;
}

class Sandwich {
  bread: string;
  filling: string;
  cheese: string;
}

// the builder interface. Defines what are the steps needed to build a product.
// In this example, the products are pizzas and sandwiches, so our builder is a cook.
interface Cook {
  prepareBase(base: string): void;
  addMeat(meat: string): void;
  addCheese(cheese: string): void;
  getResult(): Sandwich | Pizza;
  startNew(): void;
}

// the concrete builders implement the builder interface, implementing each method according to the what type of product.
// should be built.

class PizzaMaker implements Cook {
  name: string;
  private result: Pizza; // the resulting product after applying all the build steps.

  constructor(name: string) {
    this.name = name;
    this.result = new Pizza();
  }

  prepareBase(base: string): void {
    console.log(
      `${this.name} is preparing the pizza base! ${base} flour will be used.`
    );
    this.result.flour = base;
  }

  addMeat(meat: string): void {
    console.log(
      `${this.name} is adding the pizza topping! ${meat} will be used.`
    );
    this.result.topping = meat;
  }

  addCheese(cheese: string): void {
    console.log(
      `${this.name} is adding cheese to the pizza! ${cheese} will be used.`
    );
    this.result.cheese = cheese;
  }

  getResult(): Pizza {
    console.log("Pizza's ready!");
    return this.result;
  }

  startNew(): void {
    this.result = new Pizza();
  }
}

class SandwichMaker implements Cook {
  name: string;
  private result: Sandwich;

  constructor(name: string) {
    this.name = name;
    this.result = new Sandwich();
  }

  prepareBase(base: string): void {
    console.log(
      `${this.name} is preparing the sandwich bread! ${base} bread will be used.`
    );
    this.result.bread = base;
  }

  addMeat(meat: string): void {
    console.log(
      `${this.name} is adding filling the sandwich! ${meat} will be used.`
    );
    this.result.filling = meat;
  }

  addCheese(cheese: string): void {
    console.log(
      `${this.name} is adding cheese to the sandwich! ${cheese} will be used.`
    );
    this.result.cheese = cheese;
  }

  getResult(): Sandwich {
    console.log("Sandwich is ready!");
    return this.result;
  }

  startNew(): void {
    this.result = new Sandwich();
  }
}

// when creating products, you may either use a director or not. In this example, the director's class is the KitchenManager.
// The director is responsible for creating a product given a more high-level or abstract characteristic of it.
// It abstracts away the build steps and essentially creates another abstraction layer on top of the builder.

// Without using a director, the builder can be passed directly to the client code as an argument.
function createSandwichWithoutKitchenManager(
  sandwichMaker: SandwichMaker,
  bread: string,
  filling: string,
  cheese: string
): Sandwich {
  sandwichMaker.prepareBase(bread);
  sandwichMaker.addMeat(filling);
  sandwichMaker.addCheese(cheese);

  return sandwichMaker.getResult();
}

function createPizzaWithoutKitchenManager(
  pizzaMaker: PizzaMaker,
  flour: string,
  topping: string,
  cheese: string
): Pizza {
  pizzaMaker.prepareBase(flour);
  pizzaMaker.addMeat(topping);
  pizzaMaker.addCheese(cheese);

  return pizzaMaker.getResult();
}

type Food = "pizza" | "sandwich";

type Order = {
  food: Food;
  base: string;
  meat: string;
  cheese: string;
};

// Using a director (KitchenManager), the builder or builders are stored in one of the fields of the constructed Director object.
class KitchenManager {
  name: string;
  private managedCooks: Cook[];
  private activeCook: Cook;

  constructor(name: string, ...cooks: Cook[]) {
    if (cooks.length === 0)
      throw new Error("A kitchen manager must have cooks!");

    this.name = name;
    this.managedCooks = cooks;
    this.activeCook = cooks[0];
  }

  private findSuitableCook(food: Food): void {
    const RequiredCookType = (food === "pizza" && PizzaMaker) || SandwichMaker;

    if (!(this.activeCook instanceof RequiredCookType)) {
      console.log("Changing currently active cook!");
      const oneOfOurCooks = this.managedCooks.find(
        (cook) => cook instanceof RequiredCookType
      );

      if (!oneOfOurCooks) {
        this.activeCook = new RequiredCookType("George");
        this.managedCooks.push(this.activeCook);
      } else {
        this.activeCook = oneOfOurCooks;
      }
    }
  }

  fulfillOrder({ food, base, meat, cheese }: Order): Pizza | Sandwich {
    this.findSuitableCook(food);

    this.activeCook.startNew();

    this.activeCook.prepareBase(base);
    this.activeCook.addMeat(meat);
    this.activeCook.addCheese(cheese);

    return this.activeCook.getResult();
  }
}

// creating a pizza and a sandwich...
const pizzaMaker = new PizzaMaker("Anna");
const sandwichMaker = new SandwichMaker("Jeremy");

// ...without a KitchenManager
const pepperoniPizza = createPizzaWithoutKitchenManager(
  pizzaMaker,
  "wheat",
  "pepperoni",
  "brick cheese"
);
const chickenMayoSandwich = createSandwichWithoutKitchenManager(
  sandwichMaker,
  "italian",
  "chicken and mayo",
  "parmesan"
);

console.log("A pepperoni pizza:", pepperoniPizza);
console.log("A chicken mayo sandwich:", chickenMayoSandwich);

// ...with a KitchenManager
const kitchenManager = new KitchenManager("Melissa", pizzaMaker, sandwichMaker);

const groundBeefPizza = kitchenManager.fulfillOrder({
  food: "pizza",
  base: "bread",
  meat: "ground beef",
  cheese: "mozzarella",
});

const pastramiSandwich = kitchenManager.fulfillOrder({
  food: "sandwich",
  base: "whole grain",
  meat: "pastrami",
  cheese: "cheddar",
});

console.log("A ground beef pizza:", groundBeefPizza);
console.log("A pastrami sandwich:", pastramiSandwich);
