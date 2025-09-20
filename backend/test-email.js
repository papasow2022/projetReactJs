import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

console.log('🔧 Configuration email:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configuré***' : 'NON CONFIGURÉ');

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

// Test d'envoi d'email
const testEmail = async () => {
  try {
    console.log('📧 Test d\'envoi d\'email...');
    
    const transporter = createTransporter();
    
    // Vérifier la configuration
    await transporter.verify();
    console.log('✅ Configuration email valide');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Envoyer à soi-même pour le test
      subject: '🧪 Test Email - VenteChaussure',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e47911; font-size: 28px;">🧪 Test Email</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #232f3e; margin-bottom: 20px;">Test de configuration email</h2>
            
            <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
              Si vous recevez cet email, cela signifie que la configuration email fonctionne correctement !
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #28a745; color: white; font-size: 24px; font-weight: bold; 
                         padding: 20px; border-radius: 8px; display: inline-block;">
                ✅ CONFIGURATION OK
              </div>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; text-align: center;">
              Le système d'inscription avec confirmation par email est prêt à fonctionner.
            </p>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px;">
            <p>© 2024 VenteChaussure. Test de configuration.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email envoyé avec succès !');
    console.log('Message ID:', result.messageId);
    console.log('Destinataire:', mailOptions.to);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'envoi de l\'email:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Response:', error.response);
  }
};

// Lancer le test
testEmail();

