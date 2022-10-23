import { useCallback, useEffect, useState } from 'react';
import Editor from 'renderer/components/editor';
import Preview from 'renderer/components/preview';
import Sidebar from 'renderer/components/sidebar';
import styled from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';

const SaveBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 50px;
  height: 50px;
  background-color: #1e1e1e;
  color: #fff;
  font-size: 14px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #fff;
    color: #1e1e1e;
  }
`;

const EditorPage = () => {
  const [doc, setDoc] = useState<string>(
    window.electron.store.get('file') ?? ''
  );

  useEffect(() => {
    window.electron.ipcRenderer.on('file-open-reply', (event, args) => {
      setDoc(event as string);
    });
  }, []);

  const saveBtnHandler = () => {
    window.electron.ipcRenderer.sendMessage('file-save', [doc]);
    toast('🦄 File saved successfully!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      theme: 'dark',
    });
  };

  const handleDocChange = useCallback((newDoc) => {
    setDoc(newDoc);
  }, []);

  return (
    <>
      <div className="editor__page_wrapper">
        <Sidebar />
        <SaveBtn onClick={saveBtnHandler} type="button">
          Save
        </SaveBtn>
        <div className="editor">
          <Editor onChange={handleDocChange} initialDoc={doc} />
        </div>
        <Preview doc={doc} />
      </div>
    </>
  );
};

export default EditorPage;
