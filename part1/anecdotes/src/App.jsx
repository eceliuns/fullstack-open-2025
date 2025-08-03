import { useState } from "react";

const Header = ({ text }) => {
  return <h1>{text}</h1>;
};

const generateRandomNumber = (arrayLength) =>
  Math.floor(Math.random() * arrayLength);

const Button = ({ arrayLength, setSelected, current }) => {
  const handleClick = () => {
    let randomIndex = generateRandomNumber(arrayLength);
    while (randomIndex === current) {
      randomIndex = generateRandomNumber(arrayLength);
    }
    console.log(randomIndex);
    setSelected(randomIndex);
  };

  return <button onClick={handleClick}>next anecdote</button>;
};

const VoteButton = ({ selected, votes, setVotes }) => {
  const handleClick = () => {
    const copy = [...votes];
    copy[selected] += 1;
    setVotes(copy);

    console.log(copy);
  };

  return <button onClick={handleClick}>vote</button>;
};

const findMaxNumber = (array) => {
  let max = array[0];
  let maxIndex = 0;
  for (let i = 1; i < array.length; i++) {
    if (array[i] > max) {
      max = array[i];
      maxIndex = i;
    }
  }

  return maxIndex;
};

const MostVotedAnecdote = ({ array, anecdotes }) => {
  let maxIndex = findMaxNumber(array);
  return <p>{anecdotes[maxIndex]}</p>;
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  return (
    <div>
      <Header text="Anecdote of the day"></Header>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <VoteButton
        votes={votes}
        selected={selected}
        setVotes={setVotes}
      ></VoteButton>
      <Button
        arrayLength={anecdotes.length}
        setSelected={setSelected}
        current={selected}
      />
      <Header text="Anecdote with most votes"></Header>
      <MostVotedAnecdote
        array={votes}
        anecdotes={anecdotes}
      ></MostVotedAnecdote>
    </div>
  );
};

export default App;
