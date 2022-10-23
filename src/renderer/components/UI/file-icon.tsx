import React from 'react';
import { BsFillMarkdownFill } from 'react-icons/bs';
import { GrDocumentTxt } from 'react-icons/gr';
import { AiOutlineFile } from 'react-icons/ai';

interface Props {
  fileName?: string;
}

const FileIcon = ({ fileName }: Props) => {
  const ext = fileName?.split('.').pop();

  switch (ext) {
    case 'md':
      return <BsFillMarkdownFill />;
    default:
      return <AiOutlineFile />;
  }
};

export default FileIcon;
