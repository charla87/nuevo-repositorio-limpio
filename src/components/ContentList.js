import React, { useState, useEffect } from 'react';
import { getContent, deleteContent } from '../services/contentService';

const ContentList = () => {
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const data = await getContent();
    setContent(data);
  };

  const handleDelete = async (id) => {
    await deleteContent(id);
    fetchContent();
  };

  return (
    <div>
      <h1>Content List</h1>
      {content.map((item) => (
        <div key={item._id}>
          <h2>{item.title}</h2>
          <p>{item.body}</p>
          <button onClick={() => handleDelete(item._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default ContentList;
