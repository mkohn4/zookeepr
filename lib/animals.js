const fs = require("fs");
const path = require("path");

//take in requested query paramters as an argument and filter animal json data to have a new filteres array
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    //note that we save the animalsArray as filteredResults
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        //save personalityTraits as a dedicated array
        //if personalityTraits is a string, plave it into a new array and save
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }-
        //loop through each trait in the personalityTrats array
        personalityTraitsArray.forEach(trait => {
            //check trait against each animal in the filteredResults array (which initially is a copy of the animalsArray)
            //For each trait being targeted by the filter, the filteredResults array will contain only entries that contain that trait
            //so at the end we have an array of animals that have each one of the traits when the forEach loop is finished
            filteredResults = filteredResults.filter(animal => {
                animal.personalityTraits.indexOf(trait) !== -1;
            });
        });
    }
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    return filteredResults;
}

function findById(id,animalsArray) {
    //take id and array of animals and return a single animal object that matches the ID
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}

function createNewAnimal (body, animalsArray) {
    console.log(body);
    //functions main code
    const animal = body;
    animalsArray.push(animal);

    //use fs writeFile method sycnhronously to write to animals.json file
    //in data subdirectory and use path.join() to join value of __dirname
    //which is where the file is we execute the code in, with the animals.json path
    fs.writeFileSync(
        path.join(__dirname, '../data/ainals.json'),
        //save js array data as JSON
        //use null argument to not overwrite existing data
        //2 argument calls out whitespace to add between values to make it readable
        JSON.stringify({animals: animalsArray}, null, 2)
    );
    //return finished code to post route for response
    return animal;
};

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
    return true;

}

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};