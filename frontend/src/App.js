import React, { useEffect, useState } from "react";

function App() {
  const [mappings, setMappings] = useState([]);
  const [newSKU, setNewSKU] = useState("");
  const [newMSKU, setNewMSKU] = useState("");
  const [editId, setEditId] = useState(null);
  const [editSKU, setEditSKU] = useState("");
  const [editMSKU, setEditMSKU] = useState("");

  const API_BASE = "http://127.0.0.1:5000";

  // Fetch all mappings
  const fetchMappings = async () => {
    try {
      const res = await fetch(`${API_BASE}/mappings`);
      const data = await res.json();
      setMappings(data);
    } catch (err) {
      console.error("Error fetching mappings:", err);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  // Add new mapping
  const addMapping = async () => {
    if (!newSKU.trim() || !newMSKU.trim()) return alert("Both SKU and MSKU required");
    try {
      const res = await fetch(`${API_BASE}/mappings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: newSKU, msku: newMSKU }),
      });
      if (res.ok) {
        setNewSKU("");
        setNewMSKU("");
        fetchMappings();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to add mapping");
      }
    } catch (err) {
      console.error("Error adding mapping:", err);
    }
  };

  // Start editing a mapping
  const startEdit = (mapping) => {
    setEditId(mapping.id);
    setEditSKU(mapping.sku);
    setEditMSKU(mapping.msku);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditSKU("");
    setEditMSKU("");
  };

  // Save edited mapping
  const saveEdit = async () => {
    if (!editSKU.trim() || !editMSKU.trim()) return alert("Both SKU and MSKU required");
    try {
      const res = await fetch(`${API_BASE}/mappings/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku: editSKU, msku: editMSKU }),
      });
      if (res.ok) {
        cancelEdit();
        fetchMappings();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to update mapping");
      }
    } catch (err) {
      console.error("Error updating mapping:", err);
    }
  };

  // Delete mapping
  const deleteMapping = async (id) => {
    if (!window.confirm("Are you sure you want to delete this mapping?")) return;
    try {
      const res = await fetch(`${API_BASE}/mappings/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMappings();
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to delete mapping");
      }
    } catch (err) {
      console.error("Error deleting mapping:", err);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>SKU to MSKU Mapping</h1>

      {/* Add new mapping */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Enter SKU"
          value={newSKU}
          onChange={(e) => setNewSKU(e.target.value)}
          style={{ marginRight: 10, padding: 6, width: 150 }}
        />
        <input
          type="text"
          placeholder="Enter MSKU"
          value={newMSKU}
          onChange={(e) => setNewMSKU(e.target.value)}
          style={{ marginRight: 10, padding: 6, width: 150 }}
        />
        <button onClick={addMapping} style={{ padding: "6px 12px" }}>
          Add Mapping
        </button>
      </div>

      {/* Mapping list */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {mappings.map(({ id, sku, msku }) => (
          <li
            key={id}
            style={{
              marginBottom: 12,
              padding: 10,
              border: "1px solid #ccc",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {editId === id ? (
              <>
                <input
                  type="text"
                  value={editSKU}
                  onChange={(e) => setEditSKU(e.target.value)}
                  style={{ marginRight: 10, padding: 6, width: 120 }}
                />
                <input
                  type="text"
                  value={editMSKU}
                  onChange={(e) => setEditMSKU(e.target.value)}
                  style={{ marginRight: 10, padding: 6, width: 120 }}
                />
                <button onClick={saveEdit} style={{ marginRight: 5, padding: "6px 10px" }}>
                  Save
                </button>
                <button onClick={cancelEdit} style={{ padding: "6px 10px" }}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span>
                  <strong>{sku}</strong> → <em>{msku}</em>
                </span>
                <div>
                  <button onClick={() => startEdit({ id, sku, msku })} style={{ marginRight: 10 }}>
                    Edit
                  </button>
                  <button onClick={() => deleteMapping(id)} style={{ color: "red" }}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
