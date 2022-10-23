import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import FileIcon from './UI/file-icon';

const Nav = styled.div`
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 100%;
  background-color: #1e1e1e;
  color: #fff;
  font-size: 14px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  padding: 10px;
  box-sizing: border-box;
`;

const VisibleBtn = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  width: 50px;
  height: 50px;
  background-color: #1e1e1e;
  color: #fff;
  font-size: 14px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    background-color: #fff;
    color: #1e1e1e;
  }
`;

const SideBarTitle = styled.h2`
  color: white;
  background-color: transparent;
`;

const FileList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    padding: 5px;
    margin: 5px;
    border-radius: 5px;
    &:hover {
      background-color: #fff;
      color: #1e1e1e;
    }
  }

  li.active {
    background-color: #fff;
    color: #1e1e1e;
  }

  li:hover {
    background-color: #fff;
    color: #1e1e1e;
  }
`;

const NewInput = styled.input`
  border: none;
  border-radius: 5px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    outline: none;
  }
`;

const Sidebar = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [active, setActive] = useState<string>('');
  const [newFileIsVisible, setNewFileIsVisible] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');

  useEffect(() => {
    const sFiles = window.electron.store.get('folder');
    if (sFiles) {
      setFiles(sFiles);
    }
  }, []);

  const openFile = (file: string) => {
    setActive(file);
    window.electron.ipcRenderer.sendMessage('file-open', [file]);
  };

  const addNewFile = () => {
    setNewFileIsVisible(true);
  };

  const createNewFile = (e) => {
    if (e.key === 'Enter') {
      setFiles([...files, newFileName]);
      window.electron.ipcRenderer.sendMessage('file-new', [newFileName]);
      setNewFileIsVisible(false);
      setNewFileName('');
    }
  };

  return (
    <div>
      <Nav>
        <SideBarTitle>
          Dosyalar <button onClick={addNewFile}>+</button>
        </SideBarTitle>
        <FileList>
          {files.map((file, index) => (
            <li
              key={`file-${file}-${index}`}
              onClick={() => openFile(file)}
              className={active === file ? 'active' : ''}
            >
              <FileIcon fileName={file} /> {file}
            </li>
          ))}
          {newFileIsVisible && (
            <motion.li
              className="add-new-file-input"
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <NewInput
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                onKeyDown={(e) => createNewFile(e)}
              />
            </motion.li>
          )}
        </FileList>
      </Nav>
    </div>
  );
};

export default Sidebar;
