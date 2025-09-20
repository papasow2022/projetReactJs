import React, { createContext, useContext, useState, useEffect } from 'react';
import adminService from '../services/adminService.js';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin doit être utilisé dans un AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [dashboardStats, setDashboardStats] = useState({
    users: {
      totalUsers: 0,
      verifiedUsers: 0,
      adminUsers: 0,
      vendorUsers: 0,
      validatedVendors: 0,
      pendingVendors: 0
    },
    orders: {
      totalOrders: 0,
      totalRevenue: 0,
      pendingOrders: 0,
      processingOrders: 0,
      deliveredOrders: 0,
      cancelledOrders: 0
    },
    products: {
      totalProducts: 0,
      pendingProducts: 0,
      activeProducts: 0,
      totalStock: 0
    },
    support: {
      totalTickets: 0,
      openTickets: 0,
      pendingTickets: 0,
      resolvedTickets: 0
    },
    transactions: {
      totalTransactions: 0,
      totalAmount: 0,
      totalFees: 0,
      completedTransactions: 0,
      failedTransactions: 0
    },
    recentOrders: [],
    recentUsers: [],
    recentActivity: []
  });

  const [users, setUsers] = useState([]);
  const [usersPagination, setUsersPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalRecords: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Charger les statistiques du dashboard
  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getDashboardStats();
      if (response.success) {
        setDashboardStats(response.data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs
  const loadUsers = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getUsers(params);
      if (response.success) {
        setUsers(response.data.users);
        setUsersPagination(response.data.pagination);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour le rôle d'un utilisateur
  const updateUserRole = async (userId, roleData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.updateUserRole(userId, roleData);
      if (response.success) {
        // Recharger la liste des utilisateurs
        await loadUsers();
        return response;
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rôle:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques détaillées
  const loadDetailedStats = async (period = '30d') => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getDetailedStats(period);
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques détaillées:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques des commandes
  const loadOrderStats = async () => {
    try {
      const response = await adminService.getOrderStats();
      if (response.success) {
        return response.stats;
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques des commandes:', err);
      setError(err.message);
      throw err;
    }
  };

  // Charger les statistiques du support
  const loadSupportStats = async () => {
    try {
      const response = await adminService.getSupportStats();
      if (response.success) {
        return response.data;
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques du support:', err);
      setError(err.message);
      throw err;
    }
  };

  // Recharger toutes les données
  const refreshData = async () => {
    await Promise.all([
      loadDashboardStats(),
      loadUsers()
    ]);
  };

  // Effet pour charger les données au montage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.isAdmin) {
      loadDashboardStats();
    }
  }, []);

  const value = {
    dashboardStats,
    users,
    usersPagination,
    loading,
    error,
    loadDashboardStats,
    loadUsers,
    updateUserRole,
    loadDetailedStats,
    loadOrderStats,
    loadSupportStats,
    refreshData
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContext;

