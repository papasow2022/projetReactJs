import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { BiUser, BiShield, BiEdit, BiCheck, BiX } from 'react-icons/bi';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [newRoles, setNewRoles] = useState([]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      setUsers(storedUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
  };

  const updateUserRoles = (userId, roles) => {
    try {
      const updatedUsers = users.map(u => 
        u.email === userId ? { ...u, roles, isAdmin: roles.length > 0 } : u
      );
      setUsers(updatedUsers);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // Mettre à jour l'utilisateur courant si c'est lui
      if (currentUser?.email === userId) {
        const updatedCurrentUser = { ...currentUser, roles, isAdmin: roles.length > 0 };
        localStorage.setItem('user', JSON.stringify(updatedCurrentUser));
      }
      
      setEditingUser(null);
      setNewRoles([]);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des rôles:', error);
    }
  };

  const availableRoles = [
    { id: 'superadmin', label: 'Super Admin', color: 'danger' },
    { id: 'moderator', label: 'Modérateur', color: 'warning' },
    { id: 'finance', label: 'Finance', color: 'info' },
    { id: 'support', label: 'Support', color: 'secondary' },
    { id: 'viewer', label: 'Lecteur', color: 'light' }
  ];

  const startEdit = (user) => {
    setEditingUser(user.email);
    setNewRoles(user.roles || []);
  };

  const toggleRole = (roleId) => {
    setNewRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(r => r !== roleId)
        : [...prev, roleId]
    );
  };

  const saveRoles = () => {
    if (editingUser) {
      updateUserRoles(editingUser, newRoles);
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setNewRoles([]);
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h1 className="mb-0">Gestion des utilisateurs admin</h1>
        <div className="text-muted">
          <BiShield className="me-2" />
          Gestion des rôles et permissions
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Nom</th>
                  <th>Rôles actuels</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.email}>
                    <td>
                      <div className="d-flex align-items-center">
                        <BiUser className="me-2" />
                        {user.email}
                      </div>
                    </td>
                    <td>{user.prenom} {user.nom}</td>
                    <td>
                      {editingUser === user.email ? (
                        <div className="d-flex flex-wrap gap-1">
                          {availableRoles.map(role => (
                            <label key={role.id} className="form-check-label">
                              <input
                                type="checkbox"
                                className="form-check-input me-1"
                                checked={newRoles.includes(role.id)}
                                onChange={() => toggleRole(role.id)}
                              />
                              <span className={`badge bg-${role.color}`}>
                                {role.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      ) : (
                        <div className="d-flex flex-wrap gap-1">
                          {(user.roles || []).map(roleId => {
                            const role = availableRoles.find(r => r.id === roleId);
                            return role ? (
                              <span key={roleId} className={`badge bg-${role.color}`}>
                                {role.label}
                              </span>
                            ) : null;
                          })}
                          {(!user.roles || user.roles.length === 0) && (
                            <span className="badge bg-light text-dark">Aucun rôle</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td>
                      {user.isAdmin ? (
                        <span className="badge bg-success">Admin</span>
                      ) : (
                        <span className="badge bg-secondary">Utilisateur</span>
                      )}
                    </td>
                    <td>
                      {editingUser === user.email ? (
                        <div className="d-flex gap-2">
                          <button 
                            className="btn btn-sm btn-success"
                            onClick={saveRoles}
                          >
                            <BiCheck className="me-1" />
                            Sauvegarder
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-secondary"
                            onClick={cancelEdit}
                          >
                            <BiX className="me-1" />
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => startEdit(user)}
                        >
                          <BiEdit className="me-1" />
                          Modifier rôles
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h5>Guide des rôles :</h5>
        <div className="row">
          {availableRoles.map(role => (
            <div key={role.id} className="col-md-6 mb-2">
              <span className={`badge bg-${role.color} me-2`}>{role.label}</span>
              <small className="text-muted">
                {role.id === 'superadmin' && 'Accès complet à toutes les fonctionnalités'}
                {role.id === 'moderator' && 'Modération produits, avis, vendeurs'}
                {role.id === 'finance' && 'Gestion paiements, commissions, rapports'}
                {role.id === 'support' && 'Support client, tickets, assistance'}
                {role.id === 'viewer' && 'Lecture seule, consultation des données'}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}