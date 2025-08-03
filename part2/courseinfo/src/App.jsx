const Header = ({ props }) => <h1>{props.name}</h1>;

const Content = ({ props }) => {
  console.log("This is the Content log", props.parts[0]);

  return (
    <div>
      <Part props={props.parts[0]} />
      <Part props={props.parts[1]} />
      <Part props={props.parts[2]} />
    </div>
  );
};

const Part = ({ props }) => {
  console.log("This is the Part log", props);
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Total = ({ props }) => <p>Number of exercises {props.total}</p>;

const Course = ({ course }) => {
  return (
    <>
      <Header props={course}></Header>
      <Content props={course}></Content>
    </>
  );
};

const App = () => {
  const course = {
    id: 1,
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
        id: 1,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
        id: 2,
      },
      {
        name: "State of a component",
        exercises: 14,
        id: 3,
      },
    ],
  };

  return <Course course={course} />;
};

export default App;
