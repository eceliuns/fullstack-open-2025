import { useState } from "react";

const Filter = ({ persons, newSearch }) => {
  let filteredPeople = persons.filter((person) =>
    person.name.toLowerCase().includes(newSearch.toLowerCase())
  );

  return filteredPeople.map((person) => (
    <p key={person.id}>
      {person.name} {person.number}
    </p>
  ));
};

const isDuplicateName = (array, name) => {
  return array.find((element) => element.name === name);
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = { id: newName, name: newName, number: newNumber };

    if (isDuplicateName(persons, newName)) {
      alert(`${newName} is already in the phonebook`);
      return;
    }

    setPersons(persons.concat(personObject));
    setNewName("");
    setNewNumber("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with{" "}
        <input value={newSearch} onChange={handleSearchChange}></input>
      </div>
      <h2>add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Filter persons={persons} newSearch={newSearch}></Filter>
    </div>
  );
};

export default App;
