// question 3a
const fullName = (person) => {
  return `${person.firstName} ${person.lastName}`;
};
// console.log(fullName({ firstName: "Daniel", lastName: "Sah" }));

// question 3b
const isAdult = function (person) {
  //checks if age falls within 1 to 18
  if (person.age > 0 && person.age <= 18) {
    return "user is within the age of 18";
    //checks if age is greater than 18
  } else if (person.age > 18) {
    return "user is older than 18 years";
    //checks for less than 1 or invalid age entry
  } else {
    return "User did not provide a valid age";
  }
};
console.log(isAdult({ firstName: "Daniel", lastName: "Sah", age: "fd" }));

//question 3c
//array of persons object
const peopleData = [
  {
    firstName: "Daniel",
    lastName: "Sah",
    age: 25,
  },
  {
    firstName: "Francis",
    lastName: "Kyremeh",
    age: 22,
  },
  {
    firstName: "Joshua",
    lastName: "Sah",
    age: 29,
  },
  {
    firstName: "Caleb",
    lastName: "Kwasi",
    age: 16,
  },
];
const filterByAge = function (people, minAge) {
  const filteredPeople = people.filter((person) => {
    return person.age >= minAge;
  });
  return filteredPeople;
};
// console.log(filterByAge(peopleData, 23));
