// Agent IA pour le chat en ligne
import { saveTicket, generateTicketId } from './ticketStorage.js';

class AIChatbot {
  constructor() {
    this.name = "Assistant IA Ultra-Intelligent";
    this.isOnline = true;
    this.typingSpeed = 800; // Vitesse de frappe plus rapide
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.conversationHistory = []; // Mémoire conversationnelle
    this.userPreferences = {}; // Préférences utilisateur
    this.emotionalContext = 'neutral'; // Contexte émotionnel
    this.lastInteraction = null; // Dernière interaction
    this.smartSuggestions = []; // Suggestions intelligentes
    this.proactiveTriggers = new Set(); // Déclencheurs proactifs
  }

  // Initialiser la base de connaissances avancée
  initializeKnowledgeBase() {
    return {
      greetings: [
        "Bonjour ! Je suis votre assistant virtuel spécialisé. Comment puis-je vous aider aujourd'hui ?",
        "Salut ! Je connais tous les aspects de notre site. Que puis-je faire pour vous ?",
        "Bonjour ! Je peux vous aider avec vos commandes, produits, livraisons et bien plus. Que souhaitez-vous savoir ?"
      ],
      commands: {
        // PRODUITS ET CATALOGUE
        "produits": {
          keywords: ["produit", "article", "chaussure", "taille", "couleur", "disponible", "catalogue", "collection", "marque", "modèle"],
          responses: [
            "Nous avons un large catalogue de chaussures pour homme, femme et enfant. Nous proposons des marques comme Nike, Adidas, Gucci, Christian Louboutin, Prada, et bien d'autres. Que recherchez-vous exactement ?",
            "Nos produits sont organisés par catégories : chaussures homme, femme, enfant, et par marques. Voulez-vous que je vous guide vers une catégorie spécifique ?",
            "Pour trouver le produit parfait, vous pouvez utiliser notre moteur de recherche ou parcourir les catégories. Avez-vous une marque ou un style en particulier en tête ?"
          ]
        },
        "marques": {
          keywords: ["nike", "adidas", "gucci", "louboutin", "prada", "balenciaga", "puma", "converse", "vans", "mango", "zara", "minelli", "jonak"],
          responses: [
            "Nous proposons les plus grandes marques : Nike, Adidas, Gucci, Christian Louboutin, Prada, Balenciaga, Puma, Converse, Vans, Mango, Zara, Minelli, Jonak. Chaque marque a sa propre section sur notre site.",
            "Nos marques premium incluent Gucci, Christian Louboutin, Prada et Balenciaga. Pour les marques sport, nous avons Nike, Adidas, Puma. Quelle marque vous intéresse ?",
            "Chaque marque a ses propres collections et styles. Voulez-vous voir les nouveautés d'une marque spécifique ?"
          ]
        },
        "tailles": {
          keywords: ["taille", "pointure", "grand", "petit", "mesure", "guide", "sizing"],
          responses: [
            "Nous proposons toutes les tailles du 35 au 46 pour les femmes et du 38 au 48 pour les hommes. Chaque produit a son guide de tailles spécifique.",
            "Pour trouver votre taille, consultez notre guide de tailles sur chaque page produit. Les tailles peuvent varier selon les marques.",
            "Si vous hésitez sur la taille, je recommande de prendre une taille au-dessus pour plus de confort. Nous proposons aussi des échanges gratuits."
          ]
        },
        
        // COMMANDES ET PANIER
        "commande": {
          keywords: ["commande", "commander", "achat", "panier", "acheter", "passer commande", "checkout"],
          responses: [
            "Pour passer une commande : 1) Ajoutez vos articles au panier, 2) Vérifiez votre panier, 3) Procédez au paiement. Le processus est simple et sécurisé !",
            "Votre panier sauvegarde automatiquement vos articles. Vous pouvez modifier les quantités ou supprimer des articles avant de finaliser votre commande.",
            "Nous acceptons les paiements par carte bancaire, PayPal et virement. Le paiement est 100% sécurisé avec cryptage SSL."
          ]
        },
        "panier": {
          keywords: ["panier", "ajouter", "quantité", "supprimer", "modifier", "vider"],
          responses: [
            "Votre panier se sauvegarde automatiquement. Vous pouvez modifier les quantités, supprimer des articles ou ajouter des codes promo avant de commander.",
            "Pour ajouter un produit au panier, cliquez sur 'Ajouter au panier' sur la page produit. Vous verrez une confirmation et pourrez continuer vos achats.",
            "Votre panier reste disponible même après fermeture du navigateur. Vous pouvez reprendre vos achats plus tard."
          ]
        },
        
        // LIVRAISON ET EXPÉDITION
        "livraison": {
          keywords: ["livraison", "livrer", "expédition", "transport", "colis", "arriver", "délai", "frais", "gratuit"],
          responses: [
            "Livraison gratuite dès 50€ d'achat ! Délais : 2-5 jours ouvrés en France métropolitaine. Expédition sous 24h pour les commandes avant 14h.",
            "Nous livrons partout en France métropolitaine. Les frais de port sont de 4,90€ en dessous de 50€, gratuits au-dessus. Suivi de colis par email.",
            "Votre colis est expédié depuis notre entrepôt sous 24h. Vous recevrez un email de confirmation avec le numéro de suivi pour suivre votre livraison."
          ]
        },
        "suivi": {
          keywords: ["suivi", "tracking", "où", "localisation", "statut", "suivre"],
          responses: [
            "Pour suivre votre commande, utilisez le numéro de suivi envoyé par email. Vous pouvez aussi consulter votre compte client.",
            "Le suivi de votre colis est disponible dès l'expédition. Vous recevrez des notifications à chaque étape : préparation, expédition, livraison.",
            "Si vous n'avez pas reçu votre numéro de suivi, vérifiez vos spams ou contactez-nous avec votre numéro de commande."
          ]
        },
        
        // RETOURS ET ÉCHANGES
        "retour": {
          keywords: ["retour", "retourner", "remboursement", "échanger", "rendre", "défectueux", "ne convient pas"],
          responses: [
            "Retours gratuits sous 30 jours ! Remboursement sous 5 jours ouvrés après réception. Processus simple : étiquette retour incluse dans votre colis.",
            "Pour retourner un article : 1) Remplissez le formulaire de retour, 2) Utilisez l'étiquette prépayée, 3) Renvoyez le colis. Remboursement automatique.",
            "Nous acceptons les retours même si l'article ne vous convient pas. Seule condition : articles en parfait état avec emballage d'origine."
          ]
        },
        "échange": {
          keywords: ["échanger", "changer", "autre taille", "autre couleur", "remplacer"],
          responses: [
            "Échanges gratuits pour changer de taille ou couleur ! Commandez le nouveau produit et retournez l'ancien. Nous remboursons la différence si nécessaire.",
            "Pour un échange, contactez-nous avec votre numéro de commande. Nous vous enverrons le nouveau produit et vous pourrez retourner l'ancien.",
            "Les échanges sont traités rapidement. Vous recevrez le nouveau produit sous 2-3 jours ouvrés après confirmation."
          ]
        },
        
        // PAIEMENTS ET FACTURATION
        "paiement": {
          keywords: ["paiement", "payer", "carte", "facture", "prix", "coût", "tarif", "prix", "réduction", "promo"],
          responses: [
            "Paiements sécurisés acceptés : Visa, Mastercard, American Express, PayPal, virement bancaire. Cryptage SSL pour votre sécurité.",
            "Nos prix incluent la TVA. Frais de port : 4,90€ (gratuits dès 50€). Pas de frais cachés, prix transparents.",
            "Nous proposons régulièrement des promotions et codes promo. Abonnez-vous à notre newsletter pour ne rien rater !"
          ]
        },
        "facture": {
          keywords: ["facture", "reçu", "justificatif", "ticket", "preuve"],
          responses: [
            "Votre facture est automatiquement envoyée par email après paiement. Vous pouvez aussi la télécharger depuis votre compte client.",
            "Toutes nos factures sont conformes et incluent la TVA. Vous pouvez les utiliser pour vos déclarations fiscales.",
            "Si vous n'avez pas reçu votre facture, vérifiez vos spams ou contactez-nous avec votre numéro de commande."
          ]
        },
        
        // COMPTE ET PROFIL
        "compte": {
          keywords: ["compte", "profil", "connexion", "mot de passe", "inscription", "s'inscrire", "se connecter"],
          responses: [
            "Créer un compte est gratuit et vous permet de suivre vos commandes, gérer vos adresses et profiter d'avantages exclusifs.",
            "Avec votre compte, vous pouvez : suivre vos commandes, gérer vos adresses, voir votre historique d'achats, et profiter de promotions réservées.",
            "Pour vous connecter, utilisez votre email et mot de passe. Si vous avez oublié votre mot de passe, cliquez sur 'Mot de passe oublié'."
          ]
        },
        "mot de passe": {
          keywords: ["mot de passe", "oublié", "réinitialiser", "changer", "nouveau"],
          responses: [
            "Pour réinitialiser votre mot de passe : 1) Cliquez sur 'Mot de passe oublié', 2) Entrez votre email, 3) Suivez le lien reçu par email.",
            "Le lien de réinitialisation est valide 24h. Si vous ne recevez pas l'email, vérifiez vos spams ou contactez notre support.",
            "Pour changer votre mot de passe depuis votre compte : allez dans 'Paramètres' > 'Sécurité' > 'Changer le mot de passe'."
          ]
        },
        
        // VENDEURS ET MARKETPLACE
        "vendeur": {
          keywords: ["vendeur", "devenir vendeur", "vendre", "boutique", "marchand", "partenaire"],
          responses: [
            "Devenez vendeur sur notre marketplace ! Processus simple : inscription, validation, mise en ligne de vos produits. Commission compétitive.",
            "Nos vendeurs bénéficient d'un tableau de bord complet, outils de gestion, et support dédié. Rejoignez notre communauté de vendeurs !",
            "Pour devenir vendeur, remplissez le formulaire d'inscription. Notre équipe vous accompagne dans votre démarrage."
          ]
        },
        
        // SUPPORT ET CONTACT
        "contact": {
          keywords: ["contact", "aide", "support", "problème", "question", "assistance", "service client"],
          responses: [
            "Notre service client est disponible du lundi au vendredi 9h-18h. Contactez-nous par email, chat ou téléphone pour toute assistance.",
            "Pour toute question technique, problème de commande ou suggestion, notre équipe support est là pour vous aider rapidement.",
            "Nous répondons à tous les emails sous 24h. Pour les urgences, utilisez notre chat en direct ou appelez-nous."
          ]
        },
        
        // PROMOTIONS ET OFFRES
        "promo": {
          keywords: ["promo", "réduction", "offre", "code promo", "bon plan", "soldes", "black friday"],
          responses: [
            "Nous proposons régulièrement des promotions : soldes, codes promo, offres flash. Abonnez-vous à notre newsletter pour ne rien rater !",
            "Codes promo disponibles : WELCOME10 (10% de réduction première commande), LIVRAISON (livraison gratuite), NEWSLETTER (5% de réduction).",
            "Nos offres spéciales sont mises à jour régulièrement. Suivez-nous sur les réseaux sociaux pour être informé en premier !"
          ]
        },
        
        // GARANTIES ET SÉCURITÉ
        "garantie": {
          keywords: ["garantie", "sécurité", "confiance", "fiabilité", "qualité", "authenticité"],
          responses: [
            "Tous nos produits sont authentiques et garantis. Nous travaillons directement avec les marques et distributeurs officiels.",
            "Votre sécurité est notre priorité : paiements sécurisés SSL, données protégées, livraison assurée. Achat en toute confiance.",
            "Garantie satisfait ou remboursé sous 30 jours. Si vous n'êtes pas satisfait, retour gratuit et remboursement intégral."
          ]
        }
      },
      
      // Réponses intelligentes contextuelles
      contextual: {
        "heure": {
          keywords: ["heure", "ouverture", "fermeture", "disponible", "maintenant"],
          responses: [
            "Notre service client est disponible du lundi au vendredi de 9h à 18h. Les commandes sont traitées 24h/24.",
            "Vous pouvez passer commande 24h/24 sur notre site. Notre équipe traite les commandes du lundi au vendredi."
          ]
        },
        "urgence": {
          keywords: ["urgent", "rapidement", "vite", "asap", "immédiatement"],
          responses: [
            "Pour les urgences, appelez-nous directement ou utilisez notre chat en direct. Nous traitons les demandes urgentes en priorité.",
            "Si c'est urgent, notre équipe support peut vous aider rapidement par téléphone ou chat en direct."
          ]
        }
      },
      
      fallback: [
        "C'est une excellente question ! Je vais vous connecter à un de nos experts qui pourra vous donner une réponse précise.",
        "Je comprends votre demande. Laissez-moi vous transférer à un agent spécialisé qui pourra mieux vous aider.",
        "C'est un sujet intéressant ! Notre équipe support a l'expertise pour vous donner la meilleure réponse.",
        "Je vais vous connecter à un expert qui connaît parfaitement ce sujet et pourra vous assister."
      ],
      escalation: [
        "Je vous connecte à un agent humain spécialisé qui pourra vous donner une réponse personnalisée.",
        "Un de nos experts va prendre le relais pour vous offrir une assistance sur mesure.",
        "Je vous transfère à notre équipe support qui a l'expertise nécessaire pour vous aider.",
        "Un agent spécialisé va vous assister pour répondre précisément à votre demande."
      ],
      
      // Options de transfert réelles
      transferOptions: {
        "support_general": {
          name: "Support Général",
          description: "Pour les questions générales et problèmes techniques",
          contact: "sowdian57@gmail.com",
          phone: "611819930",
          whatsapp: "666706273",
          hours: "Disponible 24h/24"
        },
        "support_vendeur": {
          name: "Support Vendeurs",
          description: "Pour les questions spécifiques aux vendeurs",
          contact: "sowdian57@gmail.com",
          phone: "611819930",
          whatsapp: "666706273",
          hours: "Disponible 24h/24"
        },
        "support_technique": {
          name: "Support Technique",
          description: "Pour les problèmes techniques et bugs",
          contact: "sowdian57@gmail.com",
          phone: "611819930",
          whatsapp: "666706273",
          hours: "Disponible 24h/24"
        },
        "support_commercial": {
          name: "Support Commercial",
          description: "Pour les questions commerciales et partenariats",
          contact: "sowdian57@gmail.com",
          phone: "611819930",
          whatsapp: "666706273",
          hours: "Disponible 24h/24"
        }
      }
    };
  }

  // Analyser le message de l'utilisateur avec intelligence avancée
  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Vérifier les salutations
    if (this.isGreeting(lowerMessage)) {
      return {
        type: 'greeting',
        response: this.getRandomResponse(this.knowledgeBase.greetings)
      };
    }

    // Vérifier les réponses contextuelles en premier
    for (const [context, data] of Object.entries(this.knowledgeBase.contextual)) {
      if (data.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return {
          type: 'contextual',
          context: context,
          response: this.getRandomResponse(data.responses)
        };
      }
    }

    // Vérifier les commandes avec score de pertinence
    let bestMatch = null;
    let bestScore = 0;
    
    for (const [command, data] of Object.entries(this.knowledgeBase.commands)) {
      let score = 0;
      const matchedKeywords = [];
      
      // Calculer le score basé sur le nombre de mots-clés correspondants
      data.keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword)) {
          score += keyword.length; // Score basé sur la longueur du mot-clé
          matchedKeywords.push(keyword);
        }
      });
      
      // Bonus pour les mots-clés exacts
      if (matchedKeywords.length > 0) {
        score += matchedKeywords.length * 10;
      }
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = { command, data, matchedKeywords };
      }
    }

    // Si on a trouvé une correspondance significative
    if (bestMatch && bestScore > 5) {
      return {
        type: 'command',
        command: bestMatch.command,
        matchedKeywords: bestMatch.matchedKeywords,
        response: this.getRandomResponse(bestMatch.data.responses)
      };
    }

    // Vérifier si c'est une demande d'escalade
    if (this.isEscalationRequest(lowerMessage)) {
      return {
        type: 'escalation',
        response: this.getRandomResponse(this.knowledgeBase.escalation)
      };
    }

    // Réponse par défaut intelligente
    return {
      type: 'fallback',
      response: this.getRandomResponse(this.knowledgeBase.fallback)
    };
  }

  // Vérifier si c'est une salutation
  isGreeting(message) {
    const greetings = ['bonjour', 'salut', 'hello', 'hi', 'bonsoir', 'bonne journée'];
    return greetings.some(greeting => message.includes(greeting));
  }

  // Vérifier si c'est une demande d'escalade
  isEscalationRequest(message) {
    const escalationKeywords = ['humain', 'agent', 'personne', 'expert', 'manager', 'superviseur'];
    return escalationKeywords.some(keyword => message.includes(keyword));
  }

  // Obtenir une réponse aléatoire
  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Générer une réponse ultra-intelligente avec IA avancée
  async generateResponse(userMessage, userInfo = null) {
    // Analyser le contexte émotionnel
    this.emotionalContext = this.detectEmotion(userMessage);
    
    // Sauvegarder dans l'historique
    this.conversationHistory.push({
      user: userMessage,
      timestamp: new Date().toISOString(),
      emotion: this.emotionalContext,
      userInfo: userInfo
    });
    
    // Limiter l'historique à 10 messages
    if (this.conversationHistory.length > 10) {
      this.conversationHistory = this.conversationHistory.slice(-10);
    }
    
    // Simuler un délai de traitement intelligent
    await this.delay(this.typingSpeed);
    
    const analysis = this.analyzeMessageAdvanced(userMessage);
    let response = analysis.response;
    
    // Enrichir avec l'intelligence avancée
    response = this.enrichResponseUltra(response, analysis, userMessage, userInfo);
    
    // Générer des suggestions proactives
    this.generateSmartSuggestions(userMessage, analysis);
    
    return {
      id: Date.now(),
      type: 'ai',
      message: response,
      timestamp: new Date().toISOString(),
      analysis: analysis,
      emotion: this.emotionalContext,
      suggestions: this.smartSuggestions,
      proactive: this.shouldBeProactive(userMessage)
    };
  }

  // Enrichir la réponse avec des données contextuelles
  enrichResponse(response, analysis, userMessage, userInfo = null) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Ajouter des informations spécifiques selon le contexte
    if (analysis.type === 'command') {
      switch (analysis.command) {
        case 'produits':
          if (lowerMessage.includes('nouveau') || lowerMessage.includes('récent')) {
            response += " Découvrez nos dernières collections Nike Air Max et Adidas Ultraboost !";
          }
          break;
        case 'promo':
          response += " Actuellement : -20% sur toute la collection Nike avec le code NIKE20 !";
          break;
        case 'livraison':
          response += " En ce moment, livraison express gratuite sur toutes les commandes !";
          break;
      }
    }
    
    // Ajouter des suggestions d'actions
    if (analysis.type === 'greeting') {
      response += " Je peux vous aider à trouver des produits, suivre vos commandes, ou répondre à toutes vos questions sur notre site.";
    }
    
    // Gérer les transferts vers des experts
    if (analysis.type === 'escalation' || analysis.type === 'fallback') {
      const transferInfo = this.determineTransferType(userMessage);
      if (transferInfo) {
        response += `\n\n📞 **${transferInfo.name}**\n${transferInfo.description}\n📧 Email: ${transferInfo.contact}\n📱 Téléphone: ${transferInfo.phone}\n💬 WhatsApp: ${transferInfo.whatsapp}\n🕒 Horaires: ${transferInfo.hours}`;
        
        // Créer automatiquement un ticket de support
        const ticket = this.createSupportTicket(userMessage, userInfo);
        response += `\n\n🎫 **Ticket créé automatiquement**\nNuméro: #${ticket.id}\nUn agent humain va vous contacter prochainement.`;
      }
    }
    
    return response;
  }

  // Déterminer le type de transfert nécessaire
  determineTransferType(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Mots-clés pour chaque type de support
    const vendeurKeywords = ['vendeur', 'vendre', 'boutique', 'marchand', 'partenaire', 'devenir vendeur'];
    const techniqueKeywords = ['bug', 'erreur', 'problème technique', 'ne marche pas', 'planté', 'lent'];
    const commercialKeywords = ['partenariat', 'collaboration', 'business', 'entreprise', 'gros volume'];
    
    if (vendeurKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return this.knowledgeBase.transferOptions.support_vendeur;
    }
    
    if (techniqueKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return this.knowledgeBase.transferOptions.support_technique;
    }
    
    if (commercialKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return this.knowledgeBase.transferOptions.support_commercial;
    }
    
    // Par défaut, support général
    return this.knowledgeBase.transferOptions.support_general;
  }

  // Créer un ticket de support automatiquement
  createSupportTicket(userMessage, userInfo = null) {
    const ticketData = {
      subject: this.generateTicketSubject(userMessage),
      user: userInfo ? `${userInfo.prenom} ${userInfo.nom}` : 'Utilisateur IA',
      email: userInfo ? userInfo.email : 'contact@site.com',
      priority: this.determinePriority(userMessage),
      status: 'open',
      description: userMessage,
      category: this.determineCategory(userMessage),
      conversations: [
        {
          type: 'customer',
          message: userMessage,
          author: userInfo ? `${userInfo.prenom} ${userInfo.nom}` : 'Utilisateur',
          timestamp: new Date().toISOString()
        },
        {
          type: 'ai',
          message: 'Ticket créé automatiquement par l\'assistant IA. Un agent humain va prendre le relais.',
          author: 'Assistant IA',
          timestamp: new Date().toISOString()
        }
      ],
      source: 'ai_chat',
      aiEscalated: true
    };

    // Utiliser le système officiel de tickets
    const ticket = saveTicket(ticketData);
    
    // Notifier l'admin
    this.notifyAdminNewTicket(ticket);
    
    return ticket;
  }

  // Générer un sujet de ticket basé sur le message
  generateTicketSubject(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('vendeur')) return 'Demande d\'information - Devenir vendeur';
    if (lowerMessage.includes('bug') || lowerMessage.includes('erreur')) return 'Problème technique signalé';
    if (lowerMessage.includes('commande')) return 'Question sur une commande';
    if (lowerMessage.includes('livraison')) return 'Question sur la livraison';
    if (lowerMessage.includes('retour')) return 'Demande de retour/échange';
    if (lowerMessage.includes('paiement')) return 'Question sur le paiement';
    
    return 'Demande d\'assistance - Escalade IA';
  }

  // Déterminer la priorité du ticket
  determinePriority(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('urgent') || lowerMessage.includes('rapidement')) return 'high';
    if (lowerMessage.includes('bug') || lowerMessage.includes('ne marche pas')) return 'high';
    if (lowerMessage.includes('commande') || lowerMessage.includes('livraison')) return 'medium';
    
    return 'medium';
  }

  // Déterminer la catégorie du ticket
  determineCategory(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('vendeur')) return 'vendeur';
    if (lowerMessage.includes('bug') || lowerMessage.includes('technique')) return 'technique';
    if (lowerMessage.includes('commande')) return 'commande';
    if (lowerMessage.includes('livraison')) return 'livraison';
    if (lowerMessage.includes('retour')) return 'retour';
    if (lowerMessage.includes('paiement')) return 'paiement';
    
    return 'general';
  }


  // Notifier l'admin d'un nouveau ticket
  notifyAdminNewTicket(ticket) {
    console.log('🔔 Notification Admin - Nouveau ticket:', {
      id: ticket.id,
      subject: ticket.subject,
      priority: ticket.priority,
      category: ticket.category,
      source: 'AI Escalation'
    });
    
    // Déclencher un événement personnalisé pour notifier l'admin
    const event = new CustomEvent('newTicketFromAI', {
      detail: {
        ticket: ticket,
        source: 'ai_chat',
        timestamp: new Date().toISOString()
      }
    });
    
    // Dispatcher l'événement
    window.dispatchEvent(event);
  }

  // === FONCTIONS D'INTELLIGENCE AVANCÉE ===

  // Détecter l'émotion dans le message
  detectEmotion(message) {
    const lowerMessage = message.toLowerCase();
    
    // Mots-clés émotionnels
    const emotions = {
      'frustrated': ['frustrant', 'énervant', 'agacé', 'exaspéré', 'irritant', 'horrible', 'nul'],
      'angry': ['en colère', 'fâché', 'furieux', 'rage', 'énervé', 'pénible', 'insupportable'],
      'happy': ['content', 'heureux', 'génial', 'super', 'parfait', 'excellent', 'merci', 'bravo'],
      'sad': ['triste', 'déçu', 'déprimé', 'malheureux', 'désolé', 'dommage'],
      'urgent': ['urgent', 'rapidement', 'vite', 'asap', 'immédiatement', 'critique'],
      'confused': ['confus', 'perdu', 'pas comprendre', 'comment', 'quoi', 'pourquoi'],
      'excited': ['excité', 'impatient', 'hâte', 'vraiment', 'incroyable', 'fantastique']
    };
    
    for (const [emotion, keywords] of Object.entries(emotions)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return emotion;
      }
    }
    
    return 'neutral';
  }

  // Analyse avancée du message avec contexte
  analyzeMessageAdvanced(message) {
    const lowerMessage = message.toLowerCase();
    
    // Analyser avec le contexte de l'historique
    const contextAnalysis = this.analyzeWithContext(message);
    
    // Vérifier les salutations avec contexte
    if (this.isGreeting(lowerMessage)) {
      const contextualGreeting = this.getContextualGreeting();
      return {
        type: 'greeting',
        response: contextualGreeting,
        context: 'personalized'
      };
    }

    // Analyse émotionnelle avancée
    if (this.emotionalContext !== 'neutral') {
      const emotionalResponse = this.getEmotionalResponse(message);
      if (emotionalResponse) {
        return emotionalResponse;
      }
    }

    // Analyse avec mémoire conversationnelle
    const memoryAnalysis = this.analyzeWithMemory(message);
    if (memoryAnalysis) {
      return memoryAnalysis;
    }

    // Analyse standard améliorée
    return this.analyzeMessage(message);
  }

  // Obtenir une salutation contextuelle
  getContextualGreeting() {
    const hour = new Date().getHours();
    const userName = this.conversationHistory.length > 0 ? 
      this.conversationHistory[this.conversationHistory.length - 1].userInfo?.prenom : 'Client';
    
    let timeGreeting = '';
    if (hour < 12) timeGreeting = 'Bonjour';
    else if (hour < 18) timeGreeting = 'Bon après-midi';
    else timeGreeting = 'Bonsoir';
    
    const contextualGreetings = [
      `${timeGreeting} ${userName} ! Je suis votre assistant ultra-intelligent. Comment puis-je vous aider aujourd'hui ?`,
      `${timeGreeting} ${userName} ! Je me souviens de nos conversations précédentes. Que puis-je faire pour vous ?`,
      `${timeGreeting} ${userName} ! Je suis là pour vous offrir une expérience exceptionnelle. Comment puis-je vous assister ?`
    ];
    
    return contextualGreetings[Math.floor(Math.random() * contextualGreetings.length)];
  }

  // Réponse émotionnelle intelligente
  getEmotionalResponse(message) {
    const responses = {
      'frustrated': [
        "Je comprends votre frustration et je vais tout faire pour résoudre ce problème rapidement. Laissez-moi vous aider.",
        "Je ressens votre agacement et je m'excuse pour cette situation. Nous allons trouver une solution ensemble.",
        "Votre frustration est légitime. Je vais traiter votre demande en priorité pour vous satisfaire."
      ],
      'angry': [
        "Je comprends votre colère et je m'excuse sincèrement. Permettez-moi de résoudre cela immédiatement.",
        "Votre mécontentement est tout à fait justifié. Je vais faire de mon mieux pour corriger cette situation.",
        "Je prends votre colère très au sérieux. Laissez-moi vous aider à résoudre ce problème dès maintenant."
      ],
      'happy': [
        "Je suis ravi de voir que vous êtes satisfait ! Comment puis-je continuer à vous offrir cette excellente expérience ?",
        "Votre satisfaction me fait plaisir ! Y a-t-il autre chose que je peux faire pour vous ?",
        "C'est fantastique ! Je suis là pour maintenir ce niveau de service exceptionnel."
      ],
      'urgent': [
        "Je comprends l'urgence de votre demande. Je vais traiter cela en priorité absolue.",
        "Situation urgente détectée ! Je mobilise toutes mes ressources pour vous aider rapidement.",
        "Urgence comprise ! Je vais accélérer le processus pour vous satisfaire dans les plus brefs délais."
      ]
    };
    
    if (responses[this.emotionalContext]) {
      return {
        type: 'emotional',
        emotion: this.emotionalContext,
        response: responses[this.emotionalContext][Math.floor(Math.random() * responses[this.emotionalContext].length)]
      };
    }
    
    return null;
  }

  // Analyse avec mémoire conversationnelle
  analyzeWithMemory(message) {
    if (this.conversationHistory.length < 2) return null;
    
    const lastMessage = this.conversationHistory[this.conversationHistory.length - 1].user;
    const lowerMessage = message.toLowerCase();
    
    // Détecter les références à des conversations précédentes
    if (lowerMessage.includes('ça') || lowerMessage.includes('ce') || lowerMessage.includes('cette')) {
      return {
        type: 'contextual',
        response: "Je me souviens de notre conversation précédente. Permettez-moi de vous donner une réponse plus précise basée sur ce contexte.",
        context: 'memory'
      };
    }
    
    return null;
  }

  // Enrichissement ultra-intelligent
  enrichResponseUltra(response, analysis, userMessage, userInfo) {
    let enhancedResponse = response;
    
    // Ajouter de l'empathie selon l'émotion
    if (this.emotionalContext === 'frustrated' || this.emotionalContext === 'angry') {
      enhancedResponse = "Je comprends votre frustration. " + enhancedResponse;
    }
    
    // Ajouter des suggestions proactives
    if (this.shouldBeProactive(userMessage)) {
      enhancedResponse += this.getProactiveSuggestion(userMessage);
    }
    
    // Personnalisation basée sur l'historique
    if (this.conversationHistory.length > 3) {
      enhancedResponse += "\n\n💡 *Je remarque que nous avons déjà échangé plusieurs fois. Je peux vous offrir un service encore plus personnalisé.*";
    }
    
    return enhancedResponse;
  }

  // Générer des suggestions intelligentes
  generateSmartSuggestions(userMessage, analysis) {
    this.smartSuggestions = [];
    const lowerMessage = userMessage.toLowerCase();
    
    // Suggestions basées sur le contexte
    if (lowerMessage.includes('commande')) {
      this.smartSuggestions = [
        "Voir mes commandes en cours",
        "Suivre ma livraison",
        "Modifier ma commande"
      ];
    } else if (lowerMessage.includes('produit')) {
      this.smartSuggestions = [
        "Voir les nouveautés",
        "Rechercher par marque",
        "Guide des tailles"
      ];
    } else if (lowerMessage.includes('problème')) {
      this.smartSuggestions = [
        "Créer un ticket de support",
        "Contacter le service client",
        "Guide de dépannage"
      ];
    }
  }

  // Déterminer si être proactif
  shouldBeProactive(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const proactiveKeywords = ['merci', 'parfait', 'génial', 'super', 'excellent'];
    
    return proactiveKeywords.some(keyword => lowerMessage.includes(keyword)) ||
           this.conversationHistory.length > 5;
  }

  // Obtenir une suggestion proactive
  getProactiveSuggestion(userMessage) {
    const suggestions = [
      "\n\n🚀 *Suggestion :* Voulez-vous que je vous informe des nouvelles promotions ou produits qui pourraient vous intéresser ?",
      "\n\n💡 *Astuce :* Je peux vous aider à créer une liste de souhaits personnalisée basée sur vos préférences.",
      "\n\n⭐ *Service premium :* Souhaitez-vous recevoir des notifications exclusives sur les nouveautés de vos marques préférées ?"
    ];
    
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  }

  // Analyser avec contexte (fonction manquante)
  analyzeWithContext(message) {
    // Cette fonction peut être étendue pour une analyse contextuelle plus avancée
    return null;
  }

  // Simuler la frappe
  async simulateTyping(callback) {
    const dots = ['', '.', '..', '...'];
    let i = 0;
    
    const interval = setInterval(() => {
      callback(dots[i % dots.length]);
      i++;
    }, 500);

    // Arrêter après 3 secondes
    setTimeout(() => {
      clearInterval(interval);
      callback('');
    }, 3000);
  }

  // Délai
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Obtenir le statut
  getStatus() {
    return {
      name: this.name,
      isOnline: this.isOnline,
      avatar: '🤖'
    };
  }
}

// Instance globale
const aiChatbot = new AIChatbot();

export default aiChatbot;