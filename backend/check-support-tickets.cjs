const mongoose = require('mongoose');

async function checkSupportTickets() {
  try {
    await mongoose.connect('mongodb://localhost:27017/papasow');
    console.log('✅ Connecté à MongoDB');
    
    const db = mongoose.connection.db;
    const tickets = db.collection('support_tickets');
    
    const count = await tickets.countDocuments();
    console.log(`\n📊 Total des tickets de support: ${count}`);
    
    if (count > 0) {
      const recentTickets = await tickets.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .toArray();
      
      console.log('\n📦 Tickets récents:');
      recentTickets.forEach((ticket, index) => {
        console.log(`\n${index + 1}. Ticket ${ticket.ticketId || ticket._id}:`);
        console.log(`   - Sujet: ${ticket.subject}`);
        console.log(`   - Utilisateur: ${ticket.user}`);
        console.log(`   - Email: ${ticket.email}`);
        console.log(`   - Statut: ${ticket.status}`);
        console.log(`   - Priorité: ${ticket.priority}`);
        console.log(`   - Catégorie: ${ticket.category}`);
        console.log(`   - Créé: ${ticket.createdAt}`);
        console.log(`   - Conversations: ${ticket.conversations ? ticket.conversations.length : 0}`);
      });
      
      // Vérifier les conversations
      const ticketsWithConversations = await tickets.find({
        conversations: { $exists: true, $not: { $size: 0 } }
      }).toArray();
      
      console.log(`\n💬 Tickets avec conversations: ${ticketsWithConversations.length}`);
      
      if (ticketsWithConversations.length > 0) {
        const ticket = ticketsWithConversations[0];
        console.log(`\n📝 Exemple de conversation (Ticket ${ticket.ticketId}):`);
        ticket.conversations.forEach((conv, index) => {
          console.log(`   ${index + 1}. [${conv.type}] ${conv.author}: ${conv.message.substring(0, 50)}...`);
        });
      }
    } else {
      console.log('\n❌ Aucun ticket trouvé dans la base de données');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

checkSupportTickets();
