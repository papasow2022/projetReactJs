import Vendor from '../models/Vendor.js';
import VendorProduct from '../models/VendorProduct.js';
import VendorOrder from '../models/VendorOrder.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { 
  sendVendorRegistrationEmail, 
  sendVendorApprovalEmail, 
  sendVendorRejectionEmail,
  sendAdminVendorNotificationEmail 
} from './vendorEmailController.js';

// Créer un nouveau vendeur
export const createVendor = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const vendorData = {
      ...req.body,
      createdBy: req.user._id
    };

    const vendor = new Vendor(vendorData);
    await vendor.save();

    // Mettre à jour l'utilisateur
    await User.findByIdAndUpdate(req.user._id, {
      isVendor: true,
      vendorId: vendor._id,
      vendorStatus: 'pending'
    });

    // Envoyer email de confirmation au vendeur
    try {
      await sendVendorRegistrationEmail(vendor);
    } catch (emailError) {
      console.error('Erreur envoi email vendeur:', emailError);
      // Ne pas faire échouer la création si l'email échoue
    }

    // Envoyer notification à l'admin
    try {
      await sendAdminVendorNotificationEmail(vendor);
    } catch (emailError) {
      console.error('Erreur envoi email admin:', emailError);
      // Ne pas faire échouer la création si l'email échoue
    }

    res.status(201).json({
      success: true,
      message: 'Vendeur créé avec succès. Un email de confirmation a été envoyé.',
      vendor: {
        id: vendor._id,
        businessName: vendor.businessName,
        status: vendor.status,
        verificationStatus: vendor.verificationStatus
      }
    });
  } catch (error) {
    console.error('Erreur création vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du vendeur',
      error: error.message
    });
  }
};

// Obtenir le profil du vendeur
export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.vendorId)
      .populate('createdBy', 'prenom nom email')
      .select('-bankAccount -documents');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendeur non trouvé'
      });
    }

    res.json({
      success: true,
      vendor
    });
  } catch (error) {
    console.error('Erreur récupération profil vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil',
      error: error.message
    });
  }
};

// Mettre à jour le profil du vendeur
export const updateVendorProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const vendor = await Vendor.findByIdAndUpdate(
      req.user.vendorId,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-bankAccount -documents');

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendeur non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      vendor
    });
  } catch (error) {
    console.error('Erreur mise à jour profil vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil',
      error: error.message
    });
  }
};

// Obtenir les statistiques du vendeur
export const getVendorStats = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const period = req.query.period || '30d'; // 7d, 30d, 90d, 1y

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

    // Statistiques des commandes
    const orderStats = await VendorOrder.aggregate([
      {
        $match: {
          vendorId: vendorId,
          orderDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.total' },
          totalFees: { $sum: '$fees.totalFees' },
          averageOrderValue: { $avg: '$pricing.total' }
        }
      }
    ]);

    // Statistiques des produits
    const productStats = await VendorProduct.aggregate([
      {
        $match: { vendorId: vendorId }
      },
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          lowStockProducts: {
            $sum: { $cond: [{ $lte: ['$inventory.available', '$inventory.lowStockThreshold'] }, 1, 0] }
          }
        }
      }
    ]);

    // Commandes par statut
    const ordersByStatus = await VendorOrder.aggregate([
      {
        $match: {
          vendorId: vendorId,
          orderDate: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Revenus par mois (pour les graphiques)
    const monthlyRevenue = await VendorOrder.aggregate([
      {
        $match: {
          vendorId: vendorId,
          orderDate: { $gte: startDate },
          status: { $in: ['delivered', 'shipped'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$orderDate' },
            month: { $month: '$orderDate' }
          },
          revenue: { $sum: '$pricing.total' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    res.json({
      success: true,
      stats: {
        period,
        orders: orderStats[0] || {
          totalOrders: 0,
          totalRevenue: 0,
          totalFees: 0,
          averageOrderValue: 0
        },
        products: productStats[0] || {
          totalProducts: 0,
          activeProducts: 0,
          lowStockProducts: 0
        },
        ordersByStatus: ordersByStatus.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Erreur récupération stats vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques',
      error: error.message
    });
  }
};

// Obtenir les commandes du vendeur
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const search = req.query.search;

    const query = { vendorId };
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await VendorOrder.find(query)
      .populate('customerId', 'prenom nom email')
      .sort({ orderDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await VendorOrder.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération commandes vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des commandes',
      error: error.message
    });
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note } = req.body;

    const order = await VendorOrder.findOne({
      _id: orderId,
      vendorId: req.user.vendorId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Commande non trouvée'
      });
    }

    await order.updateStatus(status, note, req.user._id);

    res.json({
      success: true,
      message: 'Statut de la commande mis à jour',
      order: {
        id: order._id,
        status: order.status,
        orderNumber: order.orderNumber
      }
    });
  } catch (error) {
    console.error('Erreur mise à jour statut commande:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: error.message
    });
  }
};

// Obtenir les produits du vendeur
export const getVendorProducts = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const status = req.query.status;
    const category = req.query.category;
    const search = req.query.search;

    const query = { vendorId };
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await VendorProduct.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await VendorProduct.countDocuments(query);

    res.json({
      success: true,
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erreur récupération produits vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: error.message
    });
  }
};

// Créer un nouveau produit
export const createVendorProduct = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const productData = {
      ...req.body,
      vendorId: req.user.vendorId,
      createdBy: req.user._id
    };

    const product = new VendorProduct(productData);
    await product.save();

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      product: {
        id: product._id,
        name: product.name,
        sku: product.sku,
        status: product.status
      }
    });
  } catch (error) {
    console.error('Erreur création produit vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit',
      error: error.message
    });
  }
};

// Mettre à jour un produit
export const updateVendorProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const product = await VendorProduct.findOneAndUpdate(
      { _id: productId, vendorId: req.user.vendorId },
      { ...req.body, lastModified: new Date() },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      product
    });
  } catch (error) {
    console.error('Erreur mise à jour produit vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du produit',
      error: error.message
    });
  }
};

// Supprimer un produit
export const deleteVendorProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await VendorProduct.findOneAndDelete({
      _id: productId,
      vendorId: req.user.vendorId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur suppression produit vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit',
      error: error.message
    });
  }
};

// Approuver un vendeur (Admin seulement)
export const approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendeur non trouvé'
      });
    }

    // Vérifier que toutes les vérifications sont complètes
    const verificationStatus = vendor.verificationStatus;
    const isReady = Object.values(verificationStatus).every(status => status === true);

    if (!isReady) {
      return res.status(400).json({
        success: false,
        message: 'Toutes les vérifications doivent être complètes avant l\'approbation'
      });
    }

    // Mettre à jour le statut du vendeur
    vendor.status = 'active';
    await vendor.save();

    // Mettre à jour l'utilisateur
    await User.findByIdAndUpdate(vendor.createdBy, {
      isVendorValidated: true,
      vendorStatus: 'validated'
    });

    // Envoyer email d'approbation
    try {
      await sendVendorApprovalEmail(vendorId);
    } catch (emailError) {
      console.error('Erreur envoi email approbation:', emailError);
    }

    res.json({
      success: true,
      message: 'Vendeur approuvé avec succès. Un email de confirmation a été envoyé.',
      vendor: {
        id: vendor._id,
        businessName: vendor.businessName,
        status: vendor.status
      }
    });
  } catch (error) {
    console.error('Erreur approbation vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'approbation du vendeur',
      error: error.message
    });
  }
};

// Rejeter un vendeur (Admin seulement)
export const rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: 'Vendeur non trouvé'
      });
    }

    // Mettre à jour le statut du vendeur
    vendor.status = 'rejected';
    await vendor.save();

    // Mettre à jour l'utilisateur
    await User.findByIdAndUpdate(vendor.createdBy, {
      isVendorValidated: false,
      vendorStatus: 'rejected'
    });

    // Envoyer email de rejet
    try {
      await sendVendorRejectionEmail(vendorId, reason);
    } catch (emailError) {
      console.error('Erreur envoi email rejet:', emailError);
    }

    res.json({
      success: true,
      message: 'Vendeur rejeté. Un email d\'information a été envoyé.',
      vendor: {
        id: vendor._id,
        businessName: vendor.businessName,
        status: vendor.status
      }
    });
  } catch (error) {
    console.error('Erreur rejet vendeur:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du rejet du vendeur',
      error: error.message
    });
  }
};

// Obtenir la liste des vendeurs en attente (Admin seulement)
export const getPendingVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({ status: 'pending' })
      .populate('createdBy', 'prenom nom email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      vendors
    });
  } catch (error) {
    console.error('Erreur récupération vendeurs en attente:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des vendeurs',
      error: error.message
    });
  }
};
