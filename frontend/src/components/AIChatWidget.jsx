import React, { useState, useEffect, useRef } from 'react';
import { BiSend, BiX, BiBot, BiUser, BiMicrophone, BiMicrophoneOff, BiVolumeMute } from 'react-icons/bi';
import aiChatbot from '../utils/aiChatbot';
import { useAuth } from '../hooks/useAuth';

export default function AIChatWidget({ onClose }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Initialiser la reconnaissance vocale et la synthèse vocale
  useEffect(() => {
    // Initialiser la reconnaissance vocale
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
        
        // Envoyer automatiquement le message vocal
        setTimeout(() => {
          handleSendMessage(transcript);
        }, 100);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Initialiser la synthèse vocale
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Messages d'accueil avec nom de l'utilisateur
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const userName = user ? `${user.prenom} ${user.nom}` : 'Client';
      const welcomeMessage = {
        id: Date.now(),
        type: 'ai',
        message: `Bonjour ${userName} ! Je suis votre assistant virtuel. Comment puis-je vous aider aujourd'hui ?`,
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length, user]);

  // Ouvrir automatiquement si onClose est fourni (appelé depuis le bouton)
  useEffect(() => {
    if (onClose) {
      setIsOpen(true);
    }
  }, [onClose]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingText]);

  // Démarrer/arrêter la reconnaissance vocale
  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('La reconnaissance vocale n\'est pas supportée par votre navigateur.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  // Lire la réponse de l'IA à voix haute
  const speakText = (text) => {
    if (!synthRef.current) return;

    // Arrêter toute synthèse en cours
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // Arrêter la synthèse vocale
  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Gérer l'envoi de message
  const handleSendMessage = async (messageText = null) => {
    const messageToSend = messageText || inputMessage;
    if (!messageToSend.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: messageToSend,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Vider le champ de saisie seulement si c'est un message tapé
    if (!messageText) {
      setInputMessage('');
    }
    
    setIsTyping(true);

    // Simuler la frappe
    aiChatbot.simulateTyping((dots) => {
      setTypingText(dots);
    });

    // Générer la réponse IA avec informations utilisateur
    try {
      const aiResponse = await aiChatbot.generateResponse(messageToSend, user);
      setMessages(prev => [...prev, aiResponse]);
      
      // Lire automatiquement la réponse de l'IA
      setTimeout(() => {
        speakText(aiResponse.message);
      }, 500);
    } catch (error) {
      console.error('Erreur IA:', error);
      const errorMessage = {
        id: Date.now(),
        type: 'ai',
        message: 'Désolé, je rencontre un problème technique. Veuillez réessayer.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setTypingText('');
    }
  };

  // Gérer la touche Entrée
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Fermer le chat
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  // Ouvrir le chat
  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      {/* Bouton de chat flottant */}
      {!isOpen && (
        <div 
          className="position-fixed"
          style={{
            bottom: '20px',
            right: '20px',
            zIndex: 1000
          }}
        >
          <button
            className="btn btn-warning rounded-circle shadow-lg"
            style={{
              width: '60px',
              height: '60px',
              fontSize: '24px'
            }}
            onClick={handleOpen}
            title="Démarrer le chat avec l'IA"
          >
            <BiBot />
          </button>
        </div>
      )}

      {/* Widget de chat */}
      {isOpen && (
        <div 
          className="position-fixed shadow-lg"
          style={{
            bottom: '20px',
            right: '20px',
            width: '350px',
            height: '500px',
            zIndex: 1000,
            backgroundColor: 'white',
            borderRadius: '15px',
            border: '1px solid #dee2e6'
          }}
        >
          {/* Header */}
          <div 
            className="d-flex justify-content-between align-items-center p-3"
            style={{
              backgroundColor: '#ffc107',
              borderRadius: '15px 15px 0 0',
              color: 'white'
            }}
          >
            <div className="d-flex align-items-center">
              <BiBot className="me-2" style={{fontSize: '20px'}} />
              <div>
                <div className="fw-bold">Assistant IA Ultra-Intelligent</div>
                <small style={{opacity: 0.8}}>
                  🧠 IA Avancée • 💬 Vocal • 🎯 Proactif
                </small>
              </div>
            </div>
            <button
              className="btn btn-sm btn-outline-light"
              onClick={handleClose}
            >
              <BiX />
            </button>
          </div>

          {/* Messages */}
          <div 
            className="p-3"
            style={{
              height: '350px',
              overflowY: 'auto',
              backgroundColor: '#f8f9fa'
            }}
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`mb-3 d-flex ${msg.type === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                <div 
                  className={`d-flex align-items-start ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  style={{maxWidth: '80%'}}
                >
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center me-2`}
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: msg.type === 'user' ? '#007bff' : '#ffc107',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  >
                    {msg.type === 'user' ? <BiUser /> : <BiBot />}
                  </div>
                  <div 
                    className={`p-2 rounded`}
                    style={{
                      backgroundColor: msg.type === 'user' ? '#007bff' : 'white',
                      color: msg.type === 'user' ? 'white' : 'black',
                      border: msg.type === 'user' ? 'none' : '1px solid #dee2e6'
                    }}
                  >
                    <div className="mb-1">{msg.message}</div>
                    
                    {/* Suggestions intelligentes */}
                    {msg.type === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2">
                        <small className="text-muted d-block mb-1">💡 Suggestions :</small>
                        {msg.suggestions.map((suggestion, index) => (
                          <button 
                            key={index}
                            className="btn btn-sm btn-outline-primary me-1 mb-1"
                            onClick={() => {
                              setInputMessage(suggestion);
                              setTimeout(() => handleSendMessage(suggestion), 100);
                            }}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Indicateur d'émotion */}
                    {msg.type === 'ai' && msg.emotion && msg.emotion !== 'neutral' && (
                      <div className="mt-1">
                        <small className="text-muted">
                          {msg.emotion === 'happy' && '😊 Compris - Vous semblez satisfait'}
                          {msg.emotion === 'frustrated' && '😤 Je comprends votre frustration'}
                          {msg.emotion === 'angry' && '😠 Je prends votre colère au sérieux'}
                          {msg.emotion === 'urgent' && '⚡ Urgence détectée - Traitement prioritaire'}
                          {msg.emotion === 'excited' && '🎉 Je partage votre enthousiasme'}
                        </small>
                      </div>
                    )}
                    
                    {/* Boutons de transfert si c'est une réponse d'escalade */}
                    {msg.type === 'ai' && msg.message.includes('📞') && (
                      <div className="mt-2">
                        <button 
                          className="btn btn-sm btn-outline-primary me-2 mb-1"
                          onClick={() => window.open('mailto:sowdian57@gmail.com', '_blank')}
                        >
                          📧 Email Support
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-success me-2 mb-1"
                          onClick={() => window.open('tel:611819930', '_self')}
                        >
                          📱 Appeler
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-success me-2 mb-1"
                          onClick={() => window.open('https://wa.me/666706273', '_blank')}
                        >
                          💬 WhatsApp
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-info mb-1"
                          onClick={() => {
                            const newMessage = "Je souhaite être contacté par un agent humain";
                            setInputMessage(newMessage);
                            setTimeout(() => handleSendMessage(newMessage), 100);
                          }}
                        >
                          💬 Chat Humain
                        </button>
                      </div>
                    )}
                    
                    <small style={{opacity: 0.7, fontSize: '10px'}}>
                      {new Date(msg.timestamp).toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </small>
                  </div>
                </div>
              </div>
            ))}

            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="mb-3 d-flex justify-content-start">
                <div className="d-flex align-items-start">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center me-2"
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#ffc107',
                      color: 'white',
                      fontSize: '14px'
                    }}
                  >
                    <BiBot />
                  </div>
                  <div 
                    className="p-2 rounded"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #dee2e6'
                    }}
                  >
                    <div>Assistant IA est en train d'écrire{typingText}</div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-top">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder={isListening ? "Parlez maintenant..." : "Tapez votre message ou cliquez sur le microphone..."}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isTyping}
              />
              {/* Bouton microphone */}
              <button
                className={`btn ${isListening ? 'btn-danger' : 'btn-outline-secondary'}`}
                onClick={toggleVoiceInput}
                disabled={isTyping}
                title={isListening ? 'Arrêter l\'écoute' : 'Parler'}
              >
                {isListening ? <BiMicrophoneOff /> : <BiMicrophone />}
              </button>
              {/* Bouton arrêter la synthèse vocale */}
              {isSpeaking && (
                <button
                  className="btn btn-outline-danger"
                  onClick={stopSpeaking}
                  title="Arrêter la lecture"
                >
                  <BiVolumeMute />
                </button>
              )}
              <button
                className="btn btn-warning"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
              >
                <BiSend />
              </button>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted">
                Appuyez sur Entrée pour envoyer
              </small>
              <div className="d-flex gap-2">
                {isListening && (
                  <small className="text-danger">
                    <BiMicrophone className="me-1" />
                    Écoute en cours...
                  </small>
                )}
                {isSpeaking && (
                  <small className="text-primary">
                    <BiVolumeMute className="me-1" />
                    Lecture en cours...
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}