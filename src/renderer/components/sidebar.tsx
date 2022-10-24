import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { AiFillFileAdd } from 'react-icons/ai';
import { BiRefresh } from 'react-icons/bi';
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

const SideBarTitle = styled.h3`
  color: white;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
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

const NewFileButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
`;

const ButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1px;
  margin: 10px 0;
`;

const Sidebar = () => {
  const [files, setFiles] = useState<string[]>([]);
  const [active, setActive] = useState<string>('');
  const [newFileIsVisible, setNewFileIsVisible] = useState<boolean>(false);
  const [newFileName, setNewFileName] = useState<string>('');

  useEffect(() => {
    window.electron.ipcRenderer.on('folder-open-reply', (event, args) => {
      window.electron.store.set('folder', event);
      const sFiles = window.electron.store.get('folder');
      if (sFiles) {
        setFiles(sFiles);
        setActive(sFiles[0]);
      }
    });
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

  const refreshFolder = () => {
    window.electron.ipcRenderer.sendMessage('folder-refresh', []);
  };

  return (
    <div style={{ display: files.length ? 'block' : 'none' }}>
      <Nav>
        <SideBarTitle>
          Dosyalar
          <ButtonWrapper>
            <NewFileButton type="button" onClick={addNewFile}>
              <AiFillFileAdd />
            </NewFileButton>
            <NewFileButton type="button" onClick={refreshFolder}>
              <BiRefresh />
            </NewFileButton>
          </ButtonWrapper>
        </SideBarTitle>
        <FileList>
          {files.map((file) => (
            <li
              key={`file-${file}`}
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
                maxLength={10}
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
