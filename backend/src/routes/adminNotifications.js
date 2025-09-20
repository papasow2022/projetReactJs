import { Router } from 'express';
import { 
  getAdminNotifications, 
  markNotificationAsRead 
} from '../controllers/adminNotificationController.js';

const router = Router();

// Route pour récupérer les notifications admin
router.get('/notifications', getAdminNotifications);

// Route pour marquer une notification comme lue
router.patch('/notifications/:notificationId/read', markNotificationAsRead);

export default router;
