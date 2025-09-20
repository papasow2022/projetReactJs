import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config();

console.log('🧪 Test d\'envoi d\'email - PapasowCool_aide');
console.log('==========================================');

// Vérifier la configuration
console.log('📋 Configuration email:');
console.log('- EMAIL_USER:', process.env.EMAIL_USER);
console.log('- EMAIL_PASS:', process.env.EMAIL_PASS ? '***configuré***' : '❌ NON CONFIGURÉ');
console.log('- NODE_ENV:', process.env.NODE_ENV);

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error('❌ Configuration email manquante dans .env');
  process.exit(1);
}

// Configuration du transporteur email (identique au contrôleur)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Test d'envoi d'email
const testEmailSend = async () => {
  try {
    console.log('\n📧 Test de connexion au service Gmail...');
    
    const transporter = createTransporter();
    
    // Vérifier la connexion
    await transporter.verify();
    console.log('✅ Connexion Gmail réussie !');
    
    // Données de test
    const testEmail = 'sowdian57@gmail.com'; // Votre email pour recevoir le test
    const verificationCode = '123456';
    const prenom = 'Test';
    
    console.log(`\n📤 Envoi d'un email de test à: ${testEmail}`);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: testEmail,
      subject: '🧪 Test Email - PapasowCool_aide',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #e47911; font-size: 28px;">🧪 Test Email - PapasowCool_aide</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #232f3e; margin-bottom: 20px;">Test d'envoi d'email réussi !</h2>
            
            <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
              <strong>Félicitations ${prenom} !</strong><br><br>
              L'envoi d'email fonctionne parfaitement. Voici un exemple de code de vérification :
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #e47911; color: white; font-size: 36px; font-weight: bold; 
                         padding: 25px; border-radius: 12px; letter-spacing: 8px; display: inline-block;
                         box-shadow: 0 4px 15px rgba(228, 121, 17, 0.3);">
                ${verificationCode}
              </div>
            </div>
            
            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #155724; font-size: 14px; margin: 0;">
                <strong>✅ Succès :</strong> Le système d'envoi d'email est opérationnel !
              </p>
            </div>
            
            <p style="color: #6c757d; font-size: 14px; text-align: center;">
              <strong>Backend prêt :</strong> Les utilisateurs recevront bien leurs emails d'inscription.
            </p>
          </div>
          
          <div style="text-align: center; color: #6c757d; font-size: 14px;">
            <p>Test effectué le ${new Date().toLocaleString('fr-FR')}</p>
            <p>© 2024 PapasowCool_aide. Tous droits réservés.</p>
          </div>
        </div>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    
    console.log('✅ Email envoyé avec succès !');
    console.log('📧 Message ID:', result.messageId);
    console.log('📬 Vérifiez votre boîte de réception:', testEmail);
    
    console.log('\n🎉 Test réussi ! Le système d\'email est opérationnel.');
    console.log('📋 Prochaines étapes :');
    console.log('   1. Vérifiez que l\'email est arrivé dans votre boîte');
    console.log('   2. Testez l\'inscription complète via l\'API');
    console.log('   3. Finalisez le backend');
    
  } catch (error) {
    console.error('❌ Erreur lors du test d\'envoi d\'email:');
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 Solutions possibles :');
      console.error('   1. Vérifiez que le mot de passe d\'application Gmail est correct');
      console.error('   2. Assurez-vous que la 2FA est activée sur votre compte Gmail');
      console.error('   3. Générez un nouveau mot de passe d\'application si nécessaire');
    }
    
    process.exit(1);
  }
};

// Lancer le test
testEmailSend();
