import React from 'react';

interface Props {
  onClick: () => void;
}

const Home = ({ onClick }: Props) => {
  return (
    <div className="home_wrapper">
      <h1>Markdown Editor</h1>
      <div className="main-div">
        <button type="button" onClick={onClick}>
          Create Now ✏️
        </button>
      </div>
    </div>
  );
};

export default Home;
