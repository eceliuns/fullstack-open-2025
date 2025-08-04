const Header = ({ props }) => <h1>{props.name}</h1>;

const Content = ({ props }) => {
  return (
    <div>
      {props.map((part) => (
        <Part key={part.id} props={part}></Part>
      ))}
    </div>
  );
};

const Part = ({ props }) => {
  return (
    <p>
      {props.name} {props.exercises}
    </p>
  );
};

const Total = ({ props }) => {
  const totalExercises = props.reduce((sum, prop) => sum + prop.exercises, 0);

  return <p>Total of {totalExercises} exercises</p>;
};

const Course = ({ courses }) => {
  console.log(courses);
  return (
    <>
      <Header props={courses}></Header>
      <Content props={courses.parts}></Content>
      <Total props={courses.parts}></Total>
    </>
  );
};

const App = () => {
  const courses = [
    {
      name: "Half Stack application development",
      id: 1,
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
        {
          name: "Redux",
          exercises: 11,
          id: 4,
        },
      ],
    },
    {
      name: "Node.js",
      id: 2,
      parts: [
        {
          name: "Routing",
          exercises: 3,
          id: 1,
        },
        {
          name: "Middlewares",
          exercises: 7,
          id: 2,
        },
      ],
    },
  ];

  return (
    <>
      {courses.map((course) => (
        <Course key={course.id} courses={course}></Course>
      ))}
    </>
  );
};

export default App;
