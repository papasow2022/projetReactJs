import nodemailer from 'nodemailer';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';

// Configuration du transporteur email
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Envoyer email de confirmation d'inscription vendeur
export const sendVendorRegistrationEmail = async (vendorData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: vendorData.contactEmail,
      subject: '✅ Demande d\'inscription vendeur reçue - PapasowCool_aide',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e47911; font-size: 28px;">🏪 PapasowCool_aide</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #232f3e; margin-bottom: 20px;">Demande d'inscription vendeur reçue !</h2>
            
            <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
              Bonjour <strong>${vendorData.businessName}</strong>,<br><br>
              Votre demande d'inscription en tant que vendeur sur PapasowCool_aide a été reçue avec succès !
            </p>
            
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c5460; margin-top: 0;">📋 Informations de votre demande :</h3>
              <ul style="color: #0c5460; margin: 0;">
                <li><strong>Nom de l'entreprise :</strong> ${vendorData.businessName}</li>
                <li><strong>Type d'entreprise :</strong> ${vendorData.businessType}</li>
                <li><strong>Email de contact :</strong> ${vendorData.contactEmail}</li>
                <li><strong>Date de soumission :</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
                <li><strong>Numéro de demande :</strong> VD-${Date.now()}</li>
              </ul>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">⏰ Prochaines étapes :</h3>
              <ol style="color: #856404; margin: 0;">
                <li><strong>Vérification des documents</strong> - Notre équipe examine vos documents (24-48h)</li>
                <li><strong>Validation KYC</strong> - Vérification de votre identité</li>
                <li><strong>Validation bancaire</strong> - Vérification de vos informations bancaires</li>
                <li><strong>Approbation finale</strong> - Validation complète de votre compte</li>
              </ol>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #155724; font-size: 14px; margin: 0;">
                <strong>📧 Vous recevrez un email de confirmation</strong> dès que votre compte sera approuvé par notre équipe administrative.
              </p>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; text-align: center;">
              <strong>Délai de traitement :</strong> 24-72 heures ouvrables<br>
              <strong>Support :</strong> Si vous avez des questions, contactez-nous à support@papasowcool.com
            </p>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px;">
            <p>© 2024 PapasowCool_aide. Tous droits réservés.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email d\'inscription vendeur envoyé à:', vendorData.contactEmail);
    
  } catch (error) {
    console.error('❌ Erreur envoi email inscription vendeur:', error);
    throw error;
  }
};

// Envoyer email d'approbation vendeur
export const sendVendorApprovalEmail = async (vendorId) => {
  try {
    const vendor = await Vendor.findById(vendorId).populate('createdBy', 'email prenom nom');
    if (!vendor) {
      throw new Error('Vendeur non trouvé');
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: vendor.contactEmail,
      subject: '🎉 Félicitations ! Votre compte vendeur est approuvé - PapasowCool_aide',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e47911; font-size: 28px;">🎉 PapasowCool_aide</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #232f3e; margin-bottom: 20px;">Félicitations ! Votre compte vendeur est approuvé !</h2>
            
            <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
              Bonjour <strong>${vendor.businessName}</strong>,<br><br>
              Excellente nouvelle ! Votre demande d'inscription en tant que vendeur a été <strong>approuvée</strong> par notre équipe administrative.
            </p>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <h3 style="color: #155724; margin-top: 0;">✅ Votre compte est maintenant actif !</h3>
              <p style="color: #155724; font-size: 18px; margin: 0;">
                Vous pouvez maintenant accéder à votre espace vendeur et commencer à vendre vos produits.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/vendeur/dashboard" 
                 style="background-color: #e47911; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                🏪 Accéder à mon espace vendeur
              </a>
            </div>
            
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c5460; margin-top: 0;">🚀 Prochaines étapes :</h3>
              <ol style="color: #0c5460; margin: 0;">
                <li><strong>Configurer votre boutique</strong> - Personnalisez l'apparence et les informations</li>
                <li><strong>Ajouter vos produits</strong> - Créez votre catalogue de produits</li>
                <li><strong>Configurer les livraisons</strong> - Définissez vos méthodes et tarifs</li>
                <li><strong>Commencer à vendre</strong> - Votre boutique sera visible par les clients</li>
              </ol>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">💡 Conseils pour réussir :</h3>
              <ul style="color: #856404; margin: 0;">
                <li>Ajoutez des photos de qualité pour vos produits</li>
                <li>Rédigez des descriptions détaillées et attractives</li>
                <li>Fixez des prix compétitifs</li>
                <li>Répondez rapidement aux questions des clients</li>
                <li>Maintenez un bon niveau de stock</li>
              </ul>
            </div>
            
            <div style="background-color: #e2e3e5; border: 1px solid #d6d8db; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #383d41; margin-top: 0;">📞 Support et assistance :</h3>
              <p style="color: #383d41; margin: 0;">
                Notre équipe est là pour vous accompagner :<br>
                • <strong>Email :</strong> support@papasowcool.com<br>
                • <strong>Téléphone :</strong> +33 1 23 45 67 89<br>
                • <strong>Centre d'aide :</strong> <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/aide">Consulter la documentation</a>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px;">
            <p>Bienvenue dans la communauté PapasowCool_aide !</p>
            <p>© 2024 PapasowCool_aide. Tous droits réservés.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email d\'approbation vendeur envoyé à:', vendor.contactEmail);
    
  } catch (error) {
    console.error('❌ Erreur envoi email approbation vendeur:', error);
    throw error;
  }
};

// Envoyer email de rejet vendeur
export const sendVendorRejectionEmail = async (vendorId, reason = '') => {
  try {
    const vendor = await Vendor.findById(vendorId).populate('createdBy', 'email prenom nom');
    if (!vendor) {
      throw new Error('Vendeur non trouvé');
    }

    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: vendor.contactEmail,
      subject: '❌ Demande d\'inscription vendeur - Informations supplémentaires requises',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e47911; font-size: 28px;">📋 PapasowCool_aide</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #232f3e; margin-bottom: 20px;">Demande d'inscription vendeur - Action requise</h2>
            
            <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
              Bonjour <strong>${vendor.businessName}</strong>,<br><br>
              Nous avons examiné votre demande d'inscription en tant que vendeur. Malheureusement, nous avons besoin d'informations supplémentaires pour finaliser votre inscription.
            </p>
            
            <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #721c24; margin-top: 0;">📝 Informations manquantes ou à corriger :</h3>
              <p style="color: #721c24; margin: 0;">
                ${reason || 'Veuillez vérifier les informations suivantes :'}
              </p>
            </div>
            
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c5460; margin-top: 0;">🔧 Actions à effectuer :</h3>
              <ol style="color: #0c5460; margin: 0;">
                <li>Connectez-vous à votre compte</li>
                <li>Accédez à la section "Demande vendeur"</li>
                <li>Complétez ou corrigez les informations manquantes</li>
                <li>Resoumettez votre demande</li>
              </ol>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/vendeur/demande" 
                 style="background-color: #e47911; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                📝 Compléter ma demande
              </a>
            </div>
            
            <div style="background-color: #e2e3e5; border: 1px solid #d6d8db; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #383d41; margin-top: 0;">📞 Besoin d'aide ?</h3>
              <p style="color: #383d41; margin: 0;">
                Notre équipe support est disponible pour vous aider :<br>
                • <strong>Email :</strong> support@papasowcool.com<br>
                • <strong>Téléphone :</strong> +33 1 23 45 67 89
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px;">
            <p>Nous espérons vous accueillir bientôt dans notre communauté de vendeurs !</p>
            <p>© 2024 PapasowCool_aide. Tous droits réservés.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email de rejet vendeur envoyé à:', vendor.contactEmail);
    
  } catch (error) {
    console.error('❌ Erreur envoi email rejet vendeur:', error);
    throw error;
  }
};

// Envoyer email de notification admin pour nouvelle demande vendeur
export const sendAdminVendorNotificationEmail = async (vendorData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: '🔔 Nouvelle demande d\'inscription vendeur - Action requise',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e47911; font-size: 28px;">🔔 PapasowCool_aide Admin</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #232f3e; margin-bottom: 20px;">Nouvelle demande d'inscription vendeur</h2>
            
            <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
              Une nouvelle demande d'inscription en tant que vendeur a été soumise et nécessite votre validation.
            </p>
            
            <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #0c5460; margin-top: 0;">📋 Informations du vendeur :</h3>
              <ul style="color: #0c5460; margin: 0;">
                <li><strong>Nom de l'entreprise :</strong> ${vendorData.businessName}</li>
                <li><strong>Type d'entreprise :</strong> ${vendorData.businessType}</li>
                <li><strong>Email de contact :</strong> ${vendorData.contactEmail}</li>
                <li><strong>Téléphone :</strong> ${vendorData.phone}</li>
                <li><strong>Adresse :</strong> ${vendorData.businessAddress?.street}, ${vendorData.businessAddress?.city}</li>
                <li><strong>Date de soumission :</strong> ${new Date().toLocaleDateString('fr-FR')}</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin/vendors" 
                 style="background-color: #e47911; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 16px;">
                🔍 Examiner la demande
              </a>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0;">
                <strong>⏰ Action requise :</strong> Veuillez examiner cette demande dans les 24 heures pour maintenir un bon niveau de service.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px;">
            <p>© 2024 PapasowCool_aide. Tous droits réservés.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email de notification admin envoyé');
    
  } catch (error) {
    console.error('❌ Erreur envoi email notification admin:', error);
    throw error;
  }
};
