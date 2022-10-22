import React from 'react';

interface Props {
  onClick: () => void;
}

const Home = ({ onClick }: Props) => {
  const openFileHandler = () => {
    window.electron.ipcRenderer.sendMessage('file-open', []);

    window.electron.ipcRenderer.on('file-open-reply', (event, args) => {
      window.electron.store.set('file', event);
      onClick();
    });
  };

  return (
    <div className="home_wrapper">
      <h1>Markdown Editor</h1>
      <button type="button" onClick={onClick}>
        Create Now ✏️
      </button>
      <button onClick={openFileHandler}>Open File 📂</button>
    </div>
  );
};

export default Home;
