// frontend/src/App.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ nom: "", email: "", age: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const apiUrl = process.env.REACT_APP_BACKEND_URL || "/api/utilisateurs";

  const fetchUsers = async () => {
    try {
      const res = await axios.get(apiUrl);
      setUsers(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
    }
  };

  const createUser = async () => {
    try {
      await axios.post(apiUrl, newUser);
      setNewUser({ nom: "", email: "", age: "" });
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error);
    }
  };

  // Confirmation de suppression de l'utilisateur
  const deleteUser = async (id) => {
    const isConfirmed = window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (isConfirmed) {
      try {
        await axios.delete(`${apiUrl}/${id}`);
        fetchUsers();
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur:", error);
      }
    }
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setEditingUser(null);
    setIsModalOpen(false);
  };

  const updateUser = async () => {
    try {
      await axios.put(`${apiUrl}/${editingUser.id}`, editingUser);
      closeEditModal();
      fetchUsers();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestion des Utilisateurs</h1>

        <h2>Créer un Utilisateur</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Nom"
            value={newUser.nom}
            onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <input
            type="number"
            placeholder="Âge"
            value={newUser.age}
            onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
          />
          <button onClick={createUser}>Créer</button>
        </form>

        <h2>Liste des Utilisateurs</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.nom} ({user.email}) - {user.age} ans
              <button onClick={() => deleteUser(user.id)}>Supprimer</button>
              <button onClick={() => openEditModal(user)}>Modifier</button>
            </li>
          ))}
        </ul>

        {isModalOpen && editingUser && (
          <div className="modal">
            <div className="modal-content">
              <h2>Modifier l'utilisateur : {editingUser.nom}</h2>
              <form onSubmit={(e) => e.preventDefault()}>
                <input
                  type="text"
                  placeholder="Nom"
                  value={editingUser.nom}
                  onChange={(e) => setEditingUser({ ...editingUser, nom: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Âge"
                  value={editingUser.age}
                  onChange={(e) => setEditingUser({ ...editingUser, age: e.target.value })}
                />
                <button onClick={updateUser}>Valider</button>
                <button onClick={closeEditModal}>Annuler</button>
              </form>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
