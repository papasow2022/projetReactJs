// Service pour intégrer les notifications de support avec le système de notifications global
import { useNotificationSystem } from '../contexts/NotificationSystemContext';

class SupportNotificationService {
  constructor() {
    this.notificationSystem = null;
  }

  // Initialiser le service avec le contexte de notifications
  setNotificationSystem(notificationSystem) {
    this.notificationSystem = notificationSystem;
  }

  // Notifier l'admin d'un nouveau ticket
  notifyAdminNewTicket(ticket) {
    if (!this.notificationSystem) return;

    const notification = {
      id: `ticket_${ticket._id || ticket.id}`,
      type: 'new_ticket',
      title: 'Nouveau ticket de support',
      message: `${ticket.subject} - ${ticket.user} (${ticket.email})`,
      priority: ticket.priority === 'high' ? 'high' : 'medium',
      timestamp: new Date().toISOString(),
      read: false,
      category: 'support',
      color: 'info',
      icon: 'BiBell',
      data: {
        ticketId: ticket._id || ticket.id,
        ticketNumber: ticket.ticketId,
        subject: ticket.subject,
        user: ticket.user,
        email: ticket.email,
        category: ticket.category
      },
      actions: [
        {
          id: 'view_ticket',
          label: 'Voir le ticket',
          action: () => {
            // Rediriger vers la page admin support
            window.location.href = '/admin/support';
          }
        }
      ]
    };

    this.notificationSystem.addNotification(notification);
  }

  // Notifier le client d'une réponse au ticket
  notifyClientTicketReply(ticket, reply) {
    if (!this.notificationSystem) return;

    const notification = {
      id: `reply_${ticket._id || ticket.id}_${Date.now()}`,
      type: 'ticket_reply',
      title: 'Réponse à votre ticket',
      message: `Vous avez reçu une réponse sur votre ticket: ${ticket.subject}`,
      priority: 'medium',
      timestamp: new Date().toISOString(),
      read: false,
      category: 'support',
      color: 'primary',
      icon: 'BiInfoCircle',
      data: {
        ticketId: ticket._id || ticket.id,
        ticketNumber: ticket.ticketId,
        subject: ticket.subject,
        reply: reply.message,
        author: reply.author
      },
      actions: [
        {
          id: 'view_conversation',
          label: 'Voir la conversation',
          action: () => {
            // Rediriger vers la page service client
            window.location.href = '/service-client#mes-conversations';
          }
        }
      ]
    };

    this.notificationSystem.addNotification(notification);
  }

  // Notifier l'admin d'une réponse client
  notifyAdminClientReply(ticket, reply) {
    if (!this.notificationSystem) return;

    const notification = {
      id: `client_reply_${ticket._id || ticket.id}_${Date.now()}`,
      type: 'ticket_reply',
      title: 'Réponse client',
      message: `${ticket.user} a répondu au ticket: ${ticket.subject}`,
      priority: 'medium',
      timestamp: new Date().toISOString(),
      read: false,
      category: 'support',
      color: 'warning',
      icon: 'BiInfoCircle',
      data: {
        ticketId: ticket._id || ticket.id,
        ticketNumber: ticket.ticketId,
        subject: ticket.subject,
        user: ticket.user,
        email: ticket.email,
        reply: reply.message
      },
      actions: [
        {
          id: 'view_ticket',
          label: 'Voir le ticket',
          action: () => {
            // Rediriger vers la page admin support
            window.location.href = '/admin/support';
          }
        }
      ]
    };

    this.notificationSystem.addNotification(notification);
  }

  // Marquer les notifications de ticket comme lues
  markTicketNotificationsAsRead(ticketId) {
    if (!this.notificationSystem) return;

    const notifications = this.notificationSystem.notifications;
    notifications.forEach(notification => {
      if (notification.data && notification.data.ticketId === ticketId) {
        this.notificationSystem.markAsRead(notification.id);
      }
    });
  }
}

// Instance singleton
const supportNotificationService = new SupportNotificationService();

export default supportNotificationService;
