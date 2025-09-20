import express from 'express';
import mongoose from 'mongoose';
import { connectMongo } from '../lib/mongo.js';
import WaitingList from '../models/WaitingList.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configuration email
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Ajouter un email à la liste d'attente
router.post('/add', async (req, res) => {
  try {
    await connectMongo();
    
    const { email, productId, productName, category, requestedQuantity = 1 } = req.body;
    
    if (!email || !productId || !productName || !category) {
      return res.status(400).json({
        success: false,
        message: 'Email, productId, productName et category sont requis'
      });
    }
    
    // Vérifier si l'email est déjà en liste d'attente pour ce produit
    const existing = await WaitingList.findOne({
      email,
      productId,
      status: { $in: ['waiting', 'notified'] }
    });
    
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà en liste d\'attente pour ce produit'
      });
    }
    
    // Ajouter à la liste d'attente
    const waitingEntry = new WaitingList({
      email,
      productId,
      productName,
      category,
      requestedQuantity
    });
    
    await waitingEntry.save();
    
    res.json({
      success: true,
      message: 'Vous avez été ajouté à la liste d\'attente',
      waitingEntry: {
        id: waitingEntry._id,
        email: waitingEntry.email,
        productName: waitingEntry.productName,
        requestedQuantity: waitingEntry.requestedQuantity,
        status: waitingEntry.status
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur /api/waiting-list/add:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'ajout à la liste d\'attente'
    });
  }
});

// Notifier les clients en liste d'attente quand le stock est disponible
router.post('/notify/:productId', async (req, res) => {
  try {
    await connectMongo();
    
    const { productId } = req.params;
    const { availableQuantity } = req.body;
    
    // Récupérer les clients en liste d'attente pour ce produit
    const waitingEntries = await WaitingList.find({
      productId,
      status: 'waiting'
    }).sort({ createdAt: 1 }); // Premier arrivé, premier servi
    
    if (waitingEntries.length === 0) {
      return res.json({
        success: true,
        message: 'Aucun client en liste d\'attente pour ce produit',
        notified: 0
      });
    }
    
    let remainingStock = availableQuantity;
    let notifiedCount = 0;
    
    const transporter = createTransporter();
    
    for (const entry of waitingEntries) {
      if (remainingStock <= 0) break;
      
      const quantityToNotify = Math.min(entry.requestedQuantity, remainingStock);
      
      try {
        // Envoyer l'email de notification
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: entry.email,
          subject: `🎉 ${entry.productName} est de nouveau disponible !`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #e47911; font-size: 28px;">🎉 PapasowCool_aide</h1>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #232f3e; margin-bottom: 20px;">Bonne nouvelle !</h2>
                
                <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
                  Le produit <strong>${entry.productName}</strong> est de nouveau disponible !
                </p>
                
                <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                  <p style="color: #155724; font-size: 14px; margin: 0;">
                    <strong>📦 Quantité disponible :</strong> ${quantityToNotify} exemplaire(s)
                  </p>
                </div>
                
                <p style="color: #6c757d; font-size: 14px;">
                  <strong>⏰ Attention :</strong> Ce produit est très demandé. Nous vous recommandons de passer commande rapidement pour ne pas le rater !
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/produit/${entry.productId}" 
                     style="background-color: #e47911; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                    Voir le produit
                  </a>
                </div>
              </div>
              
              <div style="text-align: center; color: #6c757d; font-size: 14px;">
                <p>© 2024 PapasowCool_aide. Tous droits réservés.</p>
              </div>
            </div>
          `
        });
        
        // Marquer comme notifié
        entry.status = 'notified';
        entry.notifiedAt = new Date();
        await entry.save();
        
        remainingStock -= quantityToNotify;
        notifiedCount++;
        
      } catch (emailError) {
        console.error(`Erreur envoi email à ${entry.email}:`, emailError);
      }
    }
    
    res.json({
      success: true,
      message: `${notifiedCount} client(s) notifié(s)`,
      notified: notifiedCount,
      remainingStock
    });
    
  } catch (error) {
    console.error('❌ Erreur /api/waiting-list/notify:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la notification'
    });
  }
});

// Récupérer la liste d'attente d'un client
router.get('/user/:email', async (req, res) => {
  try {
    await connectMongo();
    
    const { email } = req.params;
    
    const waitingEntries = await WaitingList.find({
      email,
      status: { $in: ['waiting', 'notified'] }
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      waitingEntries: waitingEntries.map(entry => ({
        id: entry._id,
        productName: entry.productName,
        category: entry.category,
        requestedQuantity: entry.requestedQuantity,
        status: entry.status,
        createdAt: entry.createdAt,
        notifiedAt: entry.notifiedAt
      }))
    });
    
  } catch (error) {
    console.error('❌ Erreur /api/waiting-list/user:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de la liste d\'attente'
    });
  }
});

// Supprimer une entrée de la liste d'attente
router.delete('/remove/:entryId', async (req, res) => {
  try {
    await connectMongo();
    
    const { entryId } = req.params;
    const { email } = req.body; // Vérifier que c'est bien le bon client
    
    const entry = await WaitingList.findOneAndDelete({
      _id: entryId,
      email,
      status: { $in: ['waiting', 'notified'] }
    });
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entrée non trouvée ou déjà traitée'
      });
    }
    
    res.json({
      success: true,
      message: 'Vous avez été retiré de la liste d\'attente'
    });
    
  } catch (error) {
    console.error('❌ Erreur /api/waiting-list/remove:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la suppression'
    });
  }
});

export default router;

