import React from 'react';

interface Props {
  source: string;
}

const ImagePreview: React.FC<Props> = ({ source }) => {
  const image = `data:image/png;base64, ${source}`;
  return <img src={image} alt="preview" />;
};

export default ImagePreview;
