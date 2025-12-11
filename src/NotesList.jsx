import React from 'react';

export default function NotesList({ notes = [], onOpen, onDelete }) {
  return (
    <div>
      {notes.length === 0 && <div style={{ color: '#888' }}>No notes yet</div>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notes.map(note => (
          <li key={note.id} style={{ padding: '8px 6px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ cursor: 'pointer' }} onClick={() => onOpen(note)}>
              <div style={{ fontWeight: '600' }}>{note.title || 'Untitled'}</div>
              <div style={{ fontSize: 12, color: '#666' }}>{new Date(note.updated_at).toLocaleString()}</div>
            </div>
            <div>
              <button onClick={() => onOpen(note)} style={{ marginRight: 6 }}>Open</button>
              <button onClick={() => onDelete(note.id)}>Del</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
