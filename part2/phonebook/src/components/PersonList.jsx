import Person from "./Person";

const PersonList = ({ persons, newFilter, deletePerson }) => {
  let filteredPeople = persons.filter((person) =>
    person.name.toLowerCase().includes(newFilter.toLowerCase())
  );

  return filteredPeople.map((person) => (
    <Person
      key={person.id}
      person={person}
      deletePerson={() => deletePerson(person.id)}
    ></Person>
  ));
};

export default PersonList;
