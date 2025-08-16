import { useState, useEffect } from "react";
import axios from "axios";
import Filter from "./components/Filter";
import PersonList from "./components/PersonList";
import PersonForm from "./components/PersonForm";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    console.log("effect");
    axios.get("http://localhost:3001/persons").then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  }, []);

  const isDuplicateName = (array, name) => {
    return array.find((element) => element.name === name);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = { id: newName, name: newName, number: newNumber };

    if (isDuplicateName(persons, newName)) {
      alert(`${newName} is already in the phonebook`);
      return;
    }

    axios
      .post("http://localhost:3001/persons", personObject)
      .then((response) => {
        console.log("this is addPerson response:", response);
        setPersons(persons.concat(response.data));
        setNewName("");
        setNewNumber("");
      });
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={newFilter} onChange={handleFilterChange}></Filter>
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      ></PersonForm>
      <h3>Numbers</h3>
      <PersonList persons={persons} newFilter={newFilter}></PersonList>
    </div>
  );
};

export default App;
