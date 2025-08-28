import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function PolitiqueConfidentialite() {
  const sections = [
    {
      id: 'introduction',
      titre: 'Introduction',
      contenu: [
        'papasow s\'engage à protéger la vie privée et les données personnelles de tous ses utilisateurs, y compris les vendeurs.',
        'Cette politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations.',
        'En utilisant notre plateforme, vous acceptez les pratiques décrites dans cette politique.',
        'Nous nous conformons au Règlement Général sur la Protection des Données (RGPD) et aux lois locales applicables.'
      ]
    },
    {
      id: 'collecte',
      titre: 'Données que nous collectons',
      contenu: [
        '<strong>Données d\'identification :</strong>',
        '• Nom, prénom, adresse email, numéro de téléphone',
        '• Date de naissance, adresse postale',
        '• Numéro d\'identité nationale ou passeport',
        '',
        '<strong>Données professionnelles :</strong>',
        '• Nom et type d\'entreprise',
        '• Numéro SIRET/RC ou équivalent',
        '• Secteur d\'activité, adresse professionnelle',
        '• Documents légaux (registre de commerce, etc.)',
        '',
        '<strong>Données d\'utilisation :</strong>',
        '• Historique des ventes et transactions',
        '• Produits proposés et leurs descriptions',
        '• Interactions avec les acheteurs',
        '• Utilisation de la plateforme (pages visitées, temps passé)'
      ]
    },
    {
      id: 'utilisation',
      titre: 'Comment nous utilisons vos données',
      contenu: [
        '<strong>Gestion de votre compte vendeur :</strong>',
        '• Création et maintenance de votre profil vendeur',
        '• Authentification et sécurité de votre compte',
        '• Communication avec vous concernant votre activité',
        '',
        '<strong>Services de la plateforme :</strong>',
        '• Affichage de vos produits aux acheteurs',
        '• Traitement des commandes et paiements',
        '• Calcul et prélèvement des commissions',
        '• Support client et résolution de litiges',
        '',
        '<strong>Amélioration des services :</strong>',
        '• Analyse des performances de la plateforme',
        '• Développement de nouvelles fonctionnalités',
        '• Personnalisation de votre expérience',
        '• Prévention de la fraude et sécurité'
      ]
    },
    {
      id: 'partage',
      titre: 'Partage de vos données',
      contenu: [
        '<strong>Nous ne vendons jamais vos données personnelles.</strong>',
        '',
        '<strong>Partage autorisé avec :</strong>',
        '• <strong>Acheteurs :</strong> Informations nécessaires à la transaction (nom, adresse de livraison)',
        '• <strong>Prestataires de services :</strong> Transporteurs, processeurs de paiement, hébergeurs',
        '• <strong>Autorités :</strong> En cas d\'obligation légale ou de demande officielle',
        '• <strong>Partenaires commerciaux :</strong> Avec votre consentement explicite uniquement',
        '',
        '<strong>Protection :</strong>',
        '• Tous nos partenaires s\'engagent à respecter cette politique',
        '• Nous limitons l\'accès aux données strictement nécessaires',
        '• Nous surveillons régulièrement nos partenaires'
      ]
    },
    {
      id: 'securite',
      titre: 'Sécurité des données',
      contenu: [
        '<strong>Mesures techniques :</strong>',
        '• Chiffrement SSL/TLS pour toutes les transmissions',
        '• Stockage sécurisé avec chiffrement au repos',
        '• Authentification à deux facteurs disponible',
        '• Surveillance continue des systèmes',
        '',
        '<strong>Mesures organisationnelles :</strong>',
        '• Accès limité aux données selon le principe du moindre privilège',
        '• Formation régulière du personnel à la sécurité',
        '• Procédures de sauvegarde et de récupération',
        '• Tests de sécurité réguliers',
        '',
        '<strong>En cas d\'incident :</strong>',
        '• Notification immédiate aux autorités compétentes',
        '• Information des utilisateurs concernés dans les 72h',
        '• Mise en place de mesures correctives'
      ]
    },
    {
      id: 'conservation',
      titre: 'Conservation des données',
      contenu: [
        '<strong>Durée de conservation :</strong>',
        '• <strong>Données de compte :</strong> Tant que votre compte est actif + 3 ans après fermeture',
        '• <strong>Données de transaction :</strong> 10 ans (obligation comptable et fiscale)',
        '• <strong>Données de communication :</strong> 2 ans après la dernière interaction',
        '• <strong>Données de connexion :</strong> 12 mois',
        '',
        '<strong>Suppression :</strong>',
        '• Suppression automatique à l\'expiration des délais',
        '• Suppression immédiate sur demande (droit à l\'oubli)',
        '• Archivage sécurisé si nécessaire pour des obligations légales',
        '',
        '<strong>Exception :</strong>',
        '• Conservation prolongée en cas d\'enquête ou de litige en cours',
        '• Données anonymisées peuvent être conservées pour les statistiques'
      ]
    },
    {
      id: 'droits',
      titre: 'Vos droits',
      contenu: [
        '<strong>Droit d\'accès :</strong> Vous pouvez demander une copie de vos données personnelles.',
        '',
        '<strong>Droit de rectification :</strong> Vous pouvez corriger des données inexactes ou incomplètes.',
        '',
        '<strong>Droit à l\'effacement :</strong> Vous pouvez demander la suppression de vos données (droit à l\'oubli).',
        '',
        '<strong>Droit à la portabilité :</strong> Vous pouvez récupérer vos données dans un format structuré.',
        '',
        '<strong>Droit d\'opposition :</strong> Vous pouvez vous opposer au traitement de vos données.',
        '',
        '<strong>Droit de limitation :</strong> Vous pouvez demander la limitation du traitement.',
        '',
        '<strong>Droit de retrait :</strong> Vous pouvez retirer votre consentement à tout moment.',
        '',
        '<strong>Exercice des droits :</strong>',
        '• Contact : privacy@papasow.com',
        '• Délai de réponse : 30 jours maximum',
        '• Gratuit sauf demande manifestement infondée ou excessive'
      ]
    },
    {
      id: 'cookies',
      titre: 'Cookies et technologies similaires',
      contenu: [
        '<strong>Types de cookies utilisés :</strong>',
        '• <strong>Cookies essentiels :</strong> Fonctionnement de la plateforme (connexion, panier)',
        '• <strong>Cookies analytiques :</strong> Mesure de l\'audience et des performances',
        '• <strong>Cookies de personnalisation :</strong> Mémorisation de vos préférences',
        '• <strong>Cookies publicitaires :</strong> Publicités ciblées (avec votre consentement)',
        '',
        '<strong>Gestion des cookies :</strong>',
        '• Configuration dans les paramètres de votre navigateur',
        '• Bannière de consentement lors de votre première visite',
        '• Possibilité de désactiver les cookies non essentiels',
        '',
        '<strong>Impact :</strong>',
        '• Désactivation possible mais peut affecter certaines fonctionnalités',
        '• Les cookies essentiels ne peuvent pas être désactivés'
      ]
    },
    {
      id: 'international',
      titre: 'Transferts internationaux',
      contenu: [
        '<strong>Stockage :</strong> Vos données sont principalement stockées en Guinée.',
        '',
        '<strong>Transferts :</strong>',
        '• Vers l\'UE : Conformité au RGPD et décisions d\'adéquation',
        '• Vers d\'autres pays : Garanties contractuelles appropriées',
        '• Vers les USA : Conformité au Privacy Shield ou clauses contractuelles',
        '',
        '<strong>Protection :</strong>',
        '• Évaluation des risques avant tout transfert',
        '• Garanties contractuelles avec les sous-traitants',
        '• Surveillance continue des transferts',
        '• Droit de vous informer des transferts effectués'
      ]
    },
    {
      id: 'mineurs',
      titre: 'Protection des mineurs',
      contenu: [
        'papasow ne collecte pas sciemment de données personnelles de mineurs de moins de 16 ans.',
        '',
        '<strong>Vérification d\'âge :</strong>',
        '• Demande de date de naissance lors de l\'inscription',
        '• Vérification de l\'âge minimum pour devenir vendeur (18 ans)',
        '• Suppression immédiate si un mineur est détecté',
        '',
        '<strong>Responsabilité parentale :</strong>',
        '• Les parents/tuteurs peuvent demander la suppression des données',
        '• Contact : privacy@papasow.com avec justificatif de la relation',
        '• Traitement prioritaire des demandes concernant des mineurs'
      ]
    },
    {
      id: 'modifications',
      titre: 'Modifications de cette politique',
      contenu: [
        'papasow peut mettre à jour cette politique de confidentialité périodiquement.',
        '',
        '<strong>Notification des changements :</strong>',
        '• Email de notification 30 jours avant les modifications importantes',
        '• Affichage d\'une bannière sur la plateforme',
        '• Mise à jour de la date de dernière modification',
        '',
        '<strong>Acceptation :</strong>',
        '• Continuation de l\'utilisation = acceptation des nouvelles conditions',
        '• Possibilité de fermer votre compte si vous n\'acceptez pas',
        '• Conservation des anciennes versions sur demande',
        '',
        '<strong>Changements majeurs :</strong>',
        '• Consentement explicite requis pour les changements substantiels',
        '• Droit de retrait sans pénalité'
      ]
    },
    {
      id: 'contact',
      titre: 'Nous contacter',
      contenu: [
        '<strong>Délégué à la protection des données :</strong>',
        'Email : dpo@papasow.com',
        'Adresse : papasow SARL, Conakry, Guinée',
        '',
        '<strong>Questions générales :</strong>',
        'Email : privacy@papasow.com',
        'Téléphone : +224 XXX XXX XXX',
        '',
        '<strong>Autorité de contrôle :</strong>',
        'Commission Nationale de Protection des Données Personnelles (CNPDP)',
        'Site web : www.cnpdp.gn',
        '',
        '<strong>Délais de réponse :</strong>',
        '• Questions générales : 5 jours ouvrables',
        '• Exercice des droits : 30 jours maximum',
        '• Plaintes : 15 jours ouvrables'
      ]
    }
  ];

  return (
    <>
      <div className="container-fluid py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* En-tête */}
            <div className="text-center mb-5">
              <h1 className="mb-3 text-primary fw-bold">
                <i className="bi bi-shield-check me-3"></i>
                Politique de Confidentialité
              </h1>
              <p className="lead text-muted">Protection de vos données personnelles sur papasow</p>
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
              </div>
            </div>

            {/* Table des matières */}
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">
                  <i className="bi bi-list-ul me-2"></i>
                  Table des matières
                </h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {sections.map((section, index) => (
                    <div key={index} className="col-md-6 mb-2">
                      <a href={`#${section.id}`} className="text-decoration-none">
                        <i className="bi bi-arrow-right text-primary me-2"></i>
                        {section.titre}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contenu de la politique */}
            <div className="card">
              <div className="card-body">
                {sections.map((section, index) => (
                  <div key={index} id={section.id} className="mb-5">
                    <h3 className="text-primary fw-bold mb-3" style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>
                      {index + 1}. {section.titre}
                    </h3>
                    <div className="ps-3">
                      {section.contenu.map((item, itemIndex) => (
                        <p key={itemIndex} className="mb-2" dangerouslySetInnerHTML={{ __html: item }}></p>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Signature */}
                <div className="mt-5 pt-4 border-top">
                  <div className="row">
                    <div className="col-md-6">
                      <h5 className="fw-bold">Délégué à la protection des données :</h5>
                      <p className="small text-muted">
                        papasow SARL<br/>
                        DPO : dpo@papasow.com<br/>
                        Siège social : Conakry, Guinée<br/>
                        Téléphone : +224 XXX XXX XXX
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h5 className="fw-bold">Acceptation :</h5>
                      <p className="small text-muted">
                        En cochant la case "J'accepte la politique de confidentialité", 
                        vous reconnaissez avoir lu, compris et accepté cette politique.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="text-center mt-4">
              <Link to="/inscription-vendeur" className="btn btn-primary me-3">
                <i className="bi bi-arrow-left me-2"></i>
                Retour à l'inscription
              </Link>
              <button className="btn btn-outline-secondary" onClick={() => window.print()}>
                <i className="bi bi-printer me-2"></i>
                Imprimer
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
} 