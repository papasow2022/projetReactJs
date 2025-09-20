import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

console.log('🔧 Test de configuration email...');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configuré***' : 'NON CONFIGURÉ');

// Test simple d'envoi d'email
const testEmail = async () => {
  try {
    console.log('\n📧 Création du transporteur email...');
    
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('✅ Transporteur créé');

    console.log('\n🔍 Vérification de la configuration...');
    await transporter.verify();
    console.log('✅ Configuration email valide !');

    console.log('\n📤 Envoi de l\'email de test...');
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Envoyer à soi-même
      subject: '🧪 Test Email - VenteChaussure',
      text: 'Test de configuration email - Si vous recevez ce message, la configuration fonctionne !',
      html: `
        <h1>🧪 Test Email - VenteChaussure</h1>
        <p>Test de configuration email</p>
        <p><strong>Si vous recevez ce message, la configuration fonctionne !</strong></p>
        <p>Code de test: <strong>123456</strong></p>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email envoyé avec succès !');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Destinataire:', mailOptions.to);
    console.log('\n🎉 Configuration email fonctionnelle !');
    
  } catch (error) {
    console.error('\n❌ Erreur lors de l\'envoi de l\'email:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔑 Problème d\'authentification Gmail:');
      console.error('- Vérifiez que l\'email est correct');
      console.error('- Vérifiez que le mot de passe d\'application est correct (sans espaces)');
      console.error('- Vérifiez que la validation en 2 étapes est activée');
    }
  }
};

// Lancer le test
testEmail();
