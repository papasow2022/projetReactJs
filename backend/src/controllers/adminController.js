import mongoose from 'mongoose';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';
import connectMongo from '../lib/mongo.js';

// Obtenir les statistiques générales du dashboard admin
export const getDashboardStats = async (req, res) => {
  try {
    await connectMongo();

    // Statistiques des utilisateurs
    const userStats = await User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          verifiedUsers: { $sum: { $cond: [{ $eq: ['$isEmailVerified', true] }, 1, 0] } },
          adminUsers: { $sum: { $cond: [{ $eq: ['$isAdmin', true] }, 1, 0] } },
          vendorUsers: { $sum: { $cond: [{ $eq: ['$isVendor', true] }, 1, 0] } },
          validatedVendors: { $sum: { $cond: [{ $eq: ['$isVendorValidated', true] }, 1, 0] } },
          pendingVendors: { $sum: { $cond: [{ $eq: ['$vendorStatus', 'pending'] }, 1, 0] } }
        }
      }
    ]);

    // Statistiques des commandes (simplifiées)
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          pendingOrders: { $sum: { $cond: [{ $eq: ['$status', ORDER_STATUS.PENDING] }, 1, 0] } },
          processingOrders: { $sum: { $cond: [{ $eq: ['$status', ORDER_STATUS.PROCESSING] }, 1, 0] } },
          deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', ORDER_STATUS.DELIVERED] }, 1, 0] } },
          cancelledOrders: { $sum: { $cond: [{ $eq: ['$status', ORDER_STATUS.CANCELLED] }, 1, 0] } }
        }
      }
    ]);

    // Statistiques des produits (depuis la collection catalogue)
    const db = mongoose.connection.db;
    const catalogue = db.collection('catalogue');
    
    const productStats = await catalogue.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          pendingProducts: { $sum: { $cond: [{ $eq: ['$active', false] }, 1, 0] } },
          activeProducts: { $sum: { $cond: [{ $eq: ['$active', true] }, 1, 0] } },
          totalStock: { $sum: '$stock' }
        }
      }
    ]).toArray();

    // Commandes récentes (dernières 10)
    const recentOrders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(10)
      .select('orderNumber total status orderDate payment.status customer');

    // Utilisateurs récents (derniers 10)
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('prenom nom email isEmailVerified isAdmin isVendor createdAt');

    // Activité récente
    const recentActivity = [
      ...recentOrders.map(order => ({
        type: 'order',
        message: `Nouvelle commande #${order.orderNumber} de ${order.customer?.firstName} ${order.customer?.lastName}`,
        time: order.orderDate,
        status: order.status,
        amount: order.total
      })),
      ...recentUsers.map(user => ({
        type: 'user',
        message: `Nouvel utilisateur: ${user.prenom} ${user.nom}`,
        time: user.createdAt,
        status: user.isEmailVerified ? 'verified' : 'pending'
      }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 20);

    res.json({
      success: true,
      data: {
        users: userStats[0] || {
          totalUsers: 0,
          verifiedUsers: 0,
          adminUsers: 0,
          vendorUsers: 0,
          validatedVendors: 0,
          pendingVendors: 0
        },
        orders: orderStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          pendingOrders: 0,
          processingOrders: 0,
          deliveredOrders: 0,
          cancelledOrders: 0
        },
        products: productStats[0] || {
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
        recentOrders,
        recentUsers,
        recentActivity
      }
    });

  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
};

// Obtenir la liste des utilisateurs pour l'administration
export const getUsers = async (req, res) => {
  try {
    await connectMongo();

    const { page = 1, limit = 20, search = '', role = '', status = '' } = req.query;
    const skip = (page - 1) * limit;

    // Construire le filtre
    const filter = {};
    
    if (search) {
      filter.$or = [
        { prenom: { $regex: search, $options: 'i' } },
        { nom: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      if (role === 'admin') {
        filter.isAdmin = true;
      } else if (role === 'vendor') {
        filter.isVendor = true;
      } else if (role === 'superadmin') {
        filter.roles = 'superadmin';
      }
    }

    if (status) {
      if (status === 'verified') {
        filter.isEmailVerified = true;
      } else if (status === 'pending') {
        filter.isEmailVerified = false;
      } else if (status === 'vendor_pending') {
        filter.vendorStatus = 'pending';
      } else if (status === 'vendor_validated') {
        filter.isVendorValidated = true;
      }
    }

    const users = await User.find(filter)
      .select('-password -emailVerificationCode')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: users.length,
          totalRecords: total
        }
      }
    });

  } catch (error) {
    console.error('Erreur getUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des utilisateurs'
    });
  }
};

// Mettre à jour le rôle d'un utilisateur
export const updateUserRole = async (req, res) => {
  try {
    await connectMongo();

    const { userId } = req.params;
    const { roles, isAdmin, isVendor, isVendorValidated, vendorStatus } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Mettre à jour les rôles
    if (roles !== undefined) {
      user.roles = roles;
    }
    if (isAdmin !== undefined) {
      user.isAdmin = isAdmin;
    }
    if (isVendor !== undefined) {
      user.isVendor = isVendor;
    }
    if (isVendorValidated !== undefined) {
      user.isVendorValidated = isVendorValidated;
    }
    if (vendorStatus !== undefined) {
      user.vendorStatus = vendorStatus;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Rôle utilisateur mis à jour avec succès',
      user: {
        id: user._id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        roles: user.roles,
        isAdmin: user.isAdmin,
        isVendor: user.isVendor,
        isVendorValidated: user.isVendorValidated,
        vendorStatus: user.vendorStatus
      }
    });

  } catch (error) {
    console.error('Erreur updateUserRole:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la mise à jour du rôle'
    });
  }
};

// Obtenir les statistiques détaillées par période
export const getDetailedStats = async (req, res) => {
  try {
    await connectMongo();

    const { period = '30d' } = req.query;
    
    // Calculer les dates selon la période
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Statistiques des commandes par jour
    const ordersByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Statistiques des utilisateurs par jour
    const usersByDay = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        period,
        ordersByDay,
        usersByDay
      }
    });

  } catch (error) {
    console.error('Erreur getDetailedStats:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques détaillées'
    });
  }
};