import React, { useState } from 'react';
import { createContent } from '../services/contentService';

const ContentForm = ({ fetchContent }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createContent({ title, body });
    fetchContent();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>
      <button type="submit">Create Content</button>
    </form>
  );
};

export default ContentForm;
