import { useState, useEffect } from "react";
import axios from "axios";
import personService from "./services/persons";
import Filter from "./components/Filter";
import PersonList from "./components/PersonList";
import PersonForm from "./components/PersonForm";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [newFilter, setNewFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);

  const isDuplicateName = (array, name) => {
    return array.find((element) => element.name === name);
  };

  const isDuplicateNumber = (array, number) => {
    return array.find((element) => element.number === number);
  };

  const addPerson = (event) => {
    event.preventDefault();
    const personObject = { id: newName, name: newName, number: newNumber };

    if (
      isDuplicateName(persons, newName) &&
      isDuplicateNumber(persons, newNumber)
    ) {
      alert(`${newName} is already in the phonebook`);
      return;
    }

    if (
      isDuplicateName(persons, newName) &&
      !isDuplicateNumber(persons, newNumber)
    ) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`
        )
      ) {
        const existingPerson = persons.find((p) => p.name === newName);
        const updatedPerson = { ...existingPerson, number: newNumber };

        personService
          .update(existingPerson.id, updatedPerson)
          .then((returnedPerson) => {
            setPersons(
              persons.map((p) =>
                p.id !== existingPerson.id ? p : returnedPerson
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            alert(
              `Information of ${existingPerson.name} has already been update from the server.`
            );
            setPersons(persons.filter((p) => p.id !== existingPerson.id));
          });
        return;
      }
    }

    personService.create(personObject).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
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

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      const url = `http://localhost:3001/persons/${id}`;
      axios.delete(url).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
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
      <PersonList
        persons={persons}
        newFilter={newFilter}
        deletePerson={deletePerson}
      ></PersonList>
    </div>
  );
};

export default App;
