import React, { useCallback, useEffect } from 'react';
import useCodeMirror from './use-codemirror';

interface Props {
  initialDoc: string;
  onChange: (doc: string) => void;
}

const Editor: React.FC<Props> = ({ onChange, initialDoc }) => {
  const handleChange = useCallback(
    (state) => onChange(state.doc.toString()),
    [onChange]
  );
  const [refContainer, editorView, setNewDoc] = useCodeMirror<HTMLDivElement>({
    initialDoc: initialDoc,
    onChange: handleChange,
  });

  useEffect(() => {
    if (editorView) {
      // Do nothing for now
    }
  }, [editorView]);

  useEffect(() => {
    setNewDoc(initialDoc);
  }, [initialDoc]);

  return <div className="editor-wrapper" ref={refContainer}></div>;
};

export default Editor;
