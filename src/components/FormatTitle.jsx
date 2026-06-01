import React from 'react';

const FormatTitle = ({ title }) => {
  const match = title.match(/^(\[[A-Za-z0-9_-]+\])(.*)/s);
  if (match) {
    return (
      <>
        <span>{match[2].trim()}</span>
        <span className="block text-right text-[0.6em] font-mono opacity-30 mt-2 tracking-wider">{match[1]}</span>
      </>
    );
  }
  return <span>{title}</span>;
};

export default FormatTitle;
