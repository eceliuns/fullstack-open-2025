import { useState } from "react";

const RenderNames = ({ names }) => {
  return names.map((name) => <p key={name.id}>{name.name}</p>);
};

const isDuplicateName = (array, name) => {
  return array.find((element) => element.name === name);
};

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const addName = (event) => {
    event.preventDefault();
    console.log(persons);
    const nameObject = { name: newName, id: newName };

    if (isDuplicateName(persons, newName)) {
      alert(`${newName} is already in the phonebook`);
      return;
    }

    setPersons(persons.concat(nameObject));
    setNewName("");
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <RenderNames names={persons}></RenderNames>
    </div>
  );
};

export default App;
