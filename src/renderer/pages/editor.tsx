import CodeEditor from '@uiw/react-textarea-code-editor';
import { marked } from 'marked';
import { useState } from 'react';

const Editor = () => {
  const [text, setText] = useState<string>(
    window.electron.store.get('file') ?? ''
  );

  return (
    <div className="editor_wrapper">
      <div className="editor">
        <CodeEditor
          value={text}
          className="code_editor"
          language="markdown"
          placeholder="markdown text"
          onChange={(value) => setText(value.target.value)}
        />
      </div>
      <div className="preview">
        <div
          className="preview_content"
          dangerouslySetInnerHTML={{ __html: text ? marked(text) : '' }}
        />
      </div>
    </div>
  );
};

export default Editor;
