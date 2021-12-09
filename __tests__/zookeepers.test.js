const fs = require('fs');
//mock writing to the file system so it doesnt actually do it in testing
jest.mock('fs');

const {
    filterByQuery,
    findById,
    createNewzookeeper,
    validatezookeeper
} = require("../lib/zookeepers");

//const {zookeepers} = require("../data/zookeepers.json");


test("creates a zookeeper object", () => {
    const zookeeper = createNewzookeeper({
        name: "Darlene",
        id: "jhgdja3ng2"
    },[]);

    expect(zookeeper.name).toBe("Darlene");
    expect(zookeeper.id).toBe("jhgdja3ng2");
});

test("filters by query", () => {
    const startingzookeepers = [
        {
            id: "3",
            name: "Erica",
            age: 31,
            favoriteAnimal: "penguin"
        },
        {
            id: "4",
            name: "Noel",
            age: 67,
            favoriteAnimal: "bear"
        },
    ];

    const updatedzookeepers = filterByQuery({age: 31}, startingzookeepers);

    expect(updatedzookeepers.length).toEqual(1);
});

test("finds by id", () => {
    const startingzookeepers = [
        {
            id: "3",
            name: "Erica",
            age: 31,
            favoriteAnimal: "penguin"
        },
        {
            id: "4",
            name: "Noel",
            age: 67,
            favoriteAnimal: "bear"
        },
    ];

    const result = findById("3", startingzookeepers);
    expect(result.name).toBe("Erica");
});

test("validates age", () => {
    const zookeeper =         
    {
        id: "3",
        name: "Erica",
        age: 31,
        favoriteAnimal: "penguin"
    };

    const invalidzookeeper =  
    {
        id: "3",
        name: "Erica",
        age: '31',
        favoriteAnimal: "penguin"
    };

    const result = validatezookeeper(zookeeper);
    const result2 = validatezookeeper(invalidzookeeper);

    expect(result).toBe(true);
    expect(result2).toBe(false);
});