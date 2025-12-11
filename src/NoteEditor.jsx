import React, { useState, useEffect } from 'react';

export default function NoteEditor({ note, onSave, onClose }) {
  const [title, setTitle] = useState(note.title || '');
  const [content, setContent] = useState(note.content || '');

  useEffect(() => {
    setTitle(note.title || '');
    setContent(note.content || '');
  }, [note]);

  const handleSave = () => {
    onSave(note.id, title, content);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <input style={{ fontSize: 20, flex: 1, marginRight: 8 }} value={title} onChange={e => setTitle(e.target.value)} />
        <div>
          <button onClick={handleSave} style={{ marginRight: 8 }}>Save</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>

      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        style={{ flex: 1, padding: 12, fontSize: 14, lineHeight: '1.4', border: '1px solid #eaeaea', borderRadius: 4 }}
      />
    </div>
  );
}
