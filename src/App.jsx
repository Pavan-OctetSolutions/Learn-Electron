import React, { useEffect, useState } from "react";
import NotesList from "./NotesList";
import NoteEditor from "./NoteEditor";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [active, setActive] = useState(null); // active note object or null
  const [isEditorOpen, setEditorOpen] = useState(false);

  async function loadNotes() {
    const res = await window.notesAPI.getAllNotes();
    if (res.ok) setNotes(res.data);
    else alert("Error: " + res.message);
  }

  useEffect(() => {
    loadNotes();
  }, []);

  const handleCreate = async () => {
    const res = await window.notesAPI.createNote({
      title: "Untitled",
      content: "",
    });
    if (res.ok) {
      setNotes((prev) => [res.data, ...prev]);
      setActive(res.data);
      setEditorOpen(true);
    } else alert(res.message);
  };

  const handleUpdate = async (id, title, content) => {
    const res = await window.notesAPI.updateNote({ id, title, content });
    if (res.ok) {
      setNotes((prev) => prev.map((n) => (n.id === id ? res.data : n)));
      setActive(res.data);
    } else alert(res.message);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete note?")) return;
    const res = await window.notesAPI.deleteNote(id);
    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setActive(null);
      setEditorOpen(false);
    } else alert(res.message);
  };

  const openEditor = (note) => {
    setActive(note);
    setEditorOpen(true);
  };

  // if (!window?.notesAPI.getAllNotes) {
  //   return <div>...Loading</div>;
  // }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <aside style={{ width: 320, borderRight: "1px solid #eee", padding: 16 }}>
        <h2>Notes</h2>
        <button onClick={handleCreate} style={{ marginBottom: 12 }}>
          + New Note
        </button>
        <NotesList notes={notes} onOpen={openEditor} onDelete={handleDelete} />
      </aside>

      <main style={{ flex: 1, padding: 16 }}>
        {isEditorOpen && active ? (
          <NoteEditor
            note={active}
            onSave={handleUpdate}
            onClose={() => setEditorOpen(false)}
          />
        ) : (
          <div style={{ color: "#666" }}>
            Select a note or create a new one.
          </div>
        )}
      </main>
    </div>
  );
}
