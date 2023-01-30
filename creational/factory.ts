// The factory design pattern uses a function or method to create an object
// without exposing creation logic to the client/consumer.

type Role = "Mage" | "Warrior";

type StandardWeapon = "Hands";

type MageType = "Fire" | "Ice";
type MageWeapon = StandardWeapon | "Scepter";

type WarriorType = "Barbarian" | "Paladin";
type WarriorWeapon = StandardWeapon | "Axe" | "Sword" | "Hammer";

type CharacterWeapon = WarriorWeapon | MageWeapon;

abstract class Character {
  name: string;
  role: Role;
  level: number;
  type: MageType | WarriorType;
  identifier: string;

  constructor(name: string, role: Role, type: MageType | WarriorType, level: number) {
    this.name = name;
    this.role = role;
    this.level = level;
    this.type = type;
    this.identifier = `${this.name} [Lvl ${this.level} ${this.type} ${this.role}]`;
  }

  abstract useAbility(): void;
}

class Mage extends Character {
  type: MageType;
  usesScepter: boolean;

  constructor(name: string, level: number, type: MageType, usesScepter: boolean) {
    super(name, "Mage", type, level);

    this.usesScepter = usesScepter;
  }

  useAbility(): void {
    const actionSuffix = this.usesScepter ? " with their scepter!" : " using their magic hands!";

    if (this.type === "Fire") {
      console.log(`${this.identifier} casted a Fireball ${actionSuffix}`);
    } else {
      console.log(`${this.identifier} casted an Iceball ${actionSuffix}`);
    }
  }
}

class Warrior extends Character {
  type: WarriorType;
  weapon: WarriorWeapon;

  constructor(name: string, level: number, type: WarriorType, weapon: WarriorWeapon) {
    super(name, "Warrior", type, level);

    this.weapon = weapon;
  }

  useAbility(): void {
    console.log(`${this.identifier} swings their ${this.weapon}`);
  }
}

class CharacterFactory {
  private static readonly mageWeaponsMap: { [key in MageWeapon]: MageWeapon } = {
    Hands: "Hands",
    Scepter: "Scepter",
  };

  private static readonly warriorWeaponsMap: { [key in WarriorWeapon]: WarriorWeapon } = {
    Hands: "Hands",
    Axe: "Axe",
    Sword: "Sword",
    Hammer: "Hammer",
  }

  private getRandomType(role: Role): MageType | WarriorType {
    const isOverHalf = Math.random() > 0.5;

    if (role === "Mage") {
      if (isOverHalf) return "Fire";
      else return "Ice"
    } else {
      if (isOverHalf) return "Barbarian";
      else return "Paladin";
    }
  }

  createNewCharacter(name: string, weapon: CharacterWeapon): Character {
    const { mageWeaponsMap, warriorWeaponsMap } = CharacterFactory;

    if (Object.keys(mageWeaponsMap).includes(weapon))
      return new Mage(name, 1, (this.getRandomType("Mage") as MageType), true);
    
    if (Object.keys(warriorWeaponsMap).includes(weapon))
      return new Warrior(name, 1, (this.getRandomType("Warrior") as WarriorType), "Sword");

    throw new Error("This weapon is not available for standard characters!");
  }
}

const characterFactory = new CharacterFactory();

const warriorJohn = characterFactory.createNewCharacter("John", "Hammer");
const mageAlicia = characterFactory.createNewCharacter("Alicia", "Scepter");