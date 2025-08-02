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

const Statistics = ({ goodStatistics, neutralStatistics, badStatistics }) => {
  const total = goodStatistics + neutralStatistics + badStatistics;
  return (
    <div>
      <p>good {goodStatistics}</p>
      <p>neutral {neutralStatistics}</p>
      <p>bad {badStatistics}</p>
      <p>all {total}</p>
      <p>average {(goodStatistics - badStatistics) / total}</p>
      <p>positive {(goodStatistics / total) * 100}</p>
    </div>
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
