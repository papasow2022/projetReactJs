// Test rapide d'envoi d'email
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

console.log('🔧 Configuration:');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '***configuré***' : 'NON CONFIGURÉ');

async function testEmail() {
  try {
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    console.log('\n🔍 Vérification...');
    await transporter.verify();
    console.log('✅ Configuration valide !');

    console.log('\n📤 Envoi email...');
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: '🧪 Test VenteChaussure',
      html: '<h1>Test réussi !</h1><p>Configuration email OK</p>'
    });

    console.log('✅ Email envoyé !');
    console.log('Message ID:', result.messageId);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testEmail();
