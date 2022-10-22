import React from 'react';

interface Props {
  children: React.ReactNode;
}

const Index = ({ children }: Props) => {
  return <div className="layout">{children}</div>;
};

export default Index;
