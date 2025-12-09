export default function FileList({ files }) {
  return (
    <div style={{ marginTop: 20 }}>
      <h3>Results:</h3>

      {files.length === 0 && <p>No items found.</p>}

      <ul>
        {files.map((f, i) => (
          <li key={i}>
            {f.isDirectory ? "📁" : "📄"} {f.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
