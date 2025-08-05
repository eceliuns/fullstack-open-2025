import Person from "./Person";

const PersonList = ({ persons, newFilter }) => {
  let filteredPeople = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return filteredPeople.map((person) => <Person person={person}></Person>);
};

export default PersonList;
