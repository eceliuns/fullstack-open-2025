const Header = ({ course }) => {
  return <h1>{course}</h1>;
};

const Content = ({ parts }) => {
  return (
    <div>
      <Part parts={parts[0]}></Part>
      <Part parts={parts[1]}></Part>
      <Part parts={parts[2]}></Part>
    </div>
  );
};

const Part = ({ parts }) => {
  return (
    <p>
      {parts.name} {parts.exercises}
    </p>
  );
};

const Total = ({ parts }) => {
  return (
    <p>
      Number of exercises{" "}
      {parts[0].exercises + parts[1].exercises + parts[2].exercises}
    </p>
  );
};

const App = () => {
  const course = "Half Stack application development";
  const parts = [
    { name: "Fundamentals of react", exercises: 10 },
    { name: "Using props to pass data", exercises: 7 },
    { name: "State of a component", exercises: 14 },
  ];

  return (
    <div>
      <Header course={course}></Header>
      <Content parts={parts}></Content>
      <Total parts={parts}></Total>
    </div>
  );
};

export default App;
