const Person = ({ person }) => {
  return (
    <p key={person.id}>
      {person.name} {person.phone}
    </p>
  );
};

export default Person;
