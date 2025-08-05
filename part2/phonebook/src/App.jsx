import { useState } from "react";

const RenderPerson = ({ persons }) => {
  return persons.map((person) => (
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
    { name: "Arto Hellas", number: "040-123456" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

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

  return (
    <div>
      <h2>Phonebook</h2>
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
      <RenderPerson persons={persons}></RenderPerson>
    </div>
  );
};

export default App;
