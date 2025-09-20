import Order from '../models/Order.js';
import User from '../models/User.js';
import SupportTicket from '../models/SupportTicket.js';

// Fonction pour notifier l'admin d'une nouvelle commande
export const notifyAdminNewOrder = async (order) => {
  try {
    console.log('🔔 Notification admin - Nouvelle commande:', {
      orderNumber: order.orderNumber,
      customer: `${order.customer.firstName} ${order.customer.lastName}`,
      total: order.total,
      items: order.items.length
    });

    // Ici vous pouvez ajouter d'autres mécanismes de notification :
    // - Email à l'admin
    // - SMS
    // - Push notification
    // - Webhook vers un service externe
    
    // Pour l'instant, on log simplement
    console.log('📧 Notification envoyée à l\'admin pour la commande:', order.orderNumber);
    
    return { success: true, message: 'Admin notifié avec succès' };
  } catch (error) {
    console.error('❌ Erreur notification admin:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour notifier l'admin d'un nouveau ticket de support
export const notifyAdminNewTicket = async (ticket) => {
  try {
    console.log('🔔 Notification admin - Nouveau ticket:', {
      ticketId: ticket.ticketId,
      subject: ticket.subject,
      user: ticket.user,
      email: ticket.email,
      category: ticket.category,
      priority: ticket.priority
    });

    // Ici vous pouvez ajouter d'autres mécanismes de notification :
    // - Email à l'admin
    // - SMS
    // - Push notification
    // - Webhook vers un service externe
    
    // Pour l'instant, on log simplement
    console.log('📧 Notification envoyée à l\'admin pour le ticket:', ticket.ticketId);
    
    return { success: true, message: 'Admin notifié avec succès' };
  } catch (error) {
    console.error('❌ Erreur notification admin ticket:', error);
    return { success: false, error: error.message };
  }
};

// Fonction pour obtenir les notifications admin
export const getAdminNotifications = async (req, res) => {
  try {
    // Récupérer les commandes récentes (dernières 24h)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const recentOrders = await Order.find({
      orderDate: { $gte: yesterday },
      status: { $in: ['pending', 'confirmed'] }
    }).sort({ orderDate: -1 }).limit(20);

    // Récupérer les tickets de support récents (dernières 24h)
    const recentTickets = await SupportTicket.find({
      createdAt: { $gte: yesterday },
      status: { $in: ['open', 'pending'] }
    }).sort({ createdAt: -1 }).limit(20);

    // Récupérer les statistiques
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const todayOrders = await Order.countDocuments({
      orderDate: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({ status: 'open' });
    const todayTickets = await SupportTicket.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });

    // Formater les notifications de commandes
    const orderNotifications = recentOrders.map(order => ({
      id: order._id,
      type: 'newOrder',
      title: 'Nouvelle commande',
      message: `Commande #${order.orderNumber} - ${order.customer.firstName} ${order.customer.lastName}`,
      orderNumber: order.orderNumber,
      customer: order.customer,
      total: order.total,
      status: order.status,
      orderDate: order.orderDate,
      items: order.items.length,
      priority: 'medium'
    }));

    // Formater les notifications de tickets
    const ticketNotifications = recentTickets.map(ticket => ({
      id: ticket._id,
      type: 'newTicket',
      title: 'Nouveau ticket de support',
      message: `${ticket.subject} - ${ticket.user} (${ticket.email})`,
      ticketId: ticket.ticketId,
      subject: ticket.subject,
      user: ticket.user,
      email: ticket.email,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.createdAt,
      priority: ticket.priority === 'high' ? 'high' : 'medium'
    }));

    // Combiner et trier toutes les notifications
    const allNotifications = [...orderNotifications, ...ticketNotifications]
      .sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt))
      .slice(0, 50);

    res.json({
      success: true,
      notifications: allNotifications,
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          today: todayOrders
        },
        tickets: {
          total: totalTickets,
          open: openTickets,
          today: todayTickets
        }
      }
    });

  } catch (error) {
    console.error('❌ Erreur récupération notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des notifications'
    });
  }
};

// Fonction pour marquer une notification comme lue
export const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    // Ici vous pourriez implémenter un système de notifications persistantes
    // Pour l'instant, on retourne juste un succès
    
    res.json({
      success: true,
      message: 'Notification marquée comme lue'
    });

  } catch (error) {
    console.error('❌ Erreur marquage notification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du marquage de la notification'
    });
  }
};
