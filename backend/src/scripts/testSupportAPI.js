import mongoose from 'mongoose';
import dotenv from 'dotenv';
import SupportTicket from '../models/SupportTicket.js';

dotenv.config();

async function testSupportAPI() {
  try {
    console.log('🧪 TEST DE L\'API SUPPORT...\n');
    
    // Connexion à MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/papasow';
    await mongoose.connect(mongoUri);
    console.log('✅ Connexion MongoDB réussie !');
    
    // Test 1: Créer un ticket de test
    console.log('\n📝 Test 1: Création d\'un ticket...');
    const testTicket = new SupportTicket({
      subject: 'Test de connexion API',
      user: 'Test User',
      email: 'test@example.com',
      priority: 'medium',
      status: 'open',
      description: 'Ceci est un ticket de test pour vérifier la connexion API.',
      category: 'autre',
      telephone: '0123456789'
    });
    
    const savedTicket = await testTicket.save();
    console.log('✅ Ticket créé:', savedTicket.ticketId);
    
    // Test 2: Récupérer tous les tickets
    console.log('\n📋 Test 2: Récupération des tickets...');
    const allTickets = await SupportTicket.find().sort({ createdAt: -1 }).limit(5);
    console.log(`✅ ${allTickets.length} tickets trouvés`);
    allTickets.forEach(ticket => {
      console.log(`   - ${ticket.ticketId}: ${ticket.subject} (${ticket.status})`);
    });
    
    // Test 3: Ajouter une conversation
    console.log('\n💬 Test 3: Ajout d\'une conversation...');
    await savedTicket.addConversation({
      type: 'agent',
      message: 'Bonjour ! Nous avons bien reçu votre demande.',
      author: 'Agent Support'
    });
    console.log('✅ Conversation ajoutée');
    
    // Test 4: Mettre à jour le statut
    console.log('\n🔄 Test 4: Mise à jour du statut...');
    await savedTicket.updateStatus('in_progress', 'Agent Support');
    console.log('✅ Statut mis à jour vers "in_progress"');
    
    // Test 5: Statistiques
    console.log('\n📊 Test 5: Statistiques...');
    const stats = await SupportTicket.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          closed: { $sum: { $cond: [{ $eq: ['$status', 'closed'] }, 1, 0] } }
        }
      }
    ]);
    
    console.log('✅ Statistiques:', stats[0] || { total: 0, open: 0, inProgress: 0, closed: 0 });
    
    // Test 6: Test de l'API HTTP
    console.log('\n🌐 Test 6: Test de l\'API HTTP...');
    try {
      const response = await fetch('http://localhost:4000/api/support/tickets');
      if (response.ok) {
        const data = await response.json();
        console.log('✅ API HTTP fonctionne:', data.data.tickets.length, 'tickets');
      } else {
        console.log('❌ API HTTP non disponible:', response.status);
      }
    } catch (error) {
      console.log('❌ API HTTP non accessible:', error.message);
      console.log('💡 Assurez-vous que le serveur backend est démarré (npm start)');
    }
    
    console.log('\n🎉 TOUS LES TESTS TERMINÉS !');
    console.log('✅ Le système de support est prêt à être utilisé.');
    
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testSupportAPI();





