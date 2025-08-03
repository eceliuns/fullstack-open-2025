import { useState } from "react";

const Header = ({ text }) => {
  return <h1>{text}</h1>;
};

const RenderButtons = ({ onGoodClick, onNeutralClick, onBadClick }) => {
  return (
    <div>
      <Button text="good" handleClick={onGoodClick}></Button>
      <Button text="neutral" handleClick={onNeutralClick}></Button>
      <Button text="bad" handleClick={onBadClick}></Button>
    </div>
  );
};

const Button = ({ text, handleClick }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const StatisticLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const Statistics = ({ goodStatistics, neutralStatistics, badStatistics }) => {
  const total = goodStatistics + neutralStatistics + badStatistics;
  const average = (goodStatistics - badStatistics) / total;
  const positive = (goodStatistics / total) * 100 + " %";

  if (total === 0) {
    return <p>No feedback given</p>;
  }

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={goodStatistics}></StatisticLine>
        <StatisticLine text="neutral" value={neutralStatistics}></StatisticLine>
        <StatisticLine text="bad" value={badStatistics}></StatisticLine>
        <StatisticLine text="all" value={total}></StatisticLine>
        <StatisticLine text="average" value={average}></StatisticLine>
        <StatisticLine text="positive" value={positive}></StatisticLine>
      </tbody>
    </table>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Header text="give feedback"></Header>
      <RenderButtons
        onGoodClick={() => setGood(good + 1)}
        onNeutralClick={() => setNeutral(neutral + 1)}
        onBadClick={() => setBad(bad + 1)}
      ></RenderButtons>
      <Header text="statistics"></Header>
      <Statistics
        goodStatistics={good}
        neutralStatistics={neutral}
        badStatistics={bad}
      ></Statistics>
    </div>
  );
};

export default App;
