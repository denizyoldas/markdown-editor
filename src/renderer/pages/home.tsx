import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface Props {
  onClick?: () => void;
}

const Button = styled.button`
  background-color: white;
  padding: 10px 20px;
  border-radius: 10px;
  border: none;
  appearance: none;
  font-size: 1.3rem;
  box-shadow: 0px 8px 28px -6px rgba(24, 39, 75, 0.12),
    0px 18px 88px -4px rgba(24, 39, 75, 0.14);
  transition: all ease-in 0.1s;
  cursor: pointer;
  opacity: 0.9;

  &:hover {
    transform: scale(1.05);
    opacity: 1;
  }
`;

const Home = ({ onClick }: Props) => {
  const navigate = useNavigate();

  const navigateToEditor = () => {
    navigate('/editor');
  };

  const openFileHandler = () => {
    window.electron.ipcRenderer.sendMessage('file-open', []);

    window.electron.ipcRenderer.on('file-open-reply', (event, args) => {
      window.electron.store.set('file', event);
      navigateToEditor();
    });
  };

  const openFolderHanlder = () => {
    window.electron.ipcRenderer.sendMessage('folder-open', []);

    window.electron.ipcRenderer.on('folder-open-reply', (event, args) => {
      window.electron.store.set('folder', event);
      navigateToEditor();
    });
  };

  return (
    <div className="home_wrapper">
      <h1>Markdown Editor</h1>
      <Button type="button" onClick={navigateToEditor}>
        Create Now ✏️
      </Button>
      <Button onClick={openFileHandler} type="button">
        Open File 📂
      </Button>
      <Button type="button" onClick={openFolderHanlder}>
        Open Folder 📁
      </Button>
    </div>
  );
};

export default Home;
