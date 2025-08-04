const Header = ({ props }) => <h2>{props.name}</h2>;

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

  return (
    <p>
      <strong>total of {totalExercises} exercises</strong>
    </p>
  );
};

const Course = ({ courses }) => {
  return (
    <>
      <Header props={courses}></Header>
      <Content props={courses.parts}></Content>
      <Total props={courses.parts}></Total>
    </>
  );
};

export default Course;
