import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ConditionsVente() {
  const sections = [
    {
      id: 'preambule',
      titre: 'Préambule',
      contenu: [
        'Les présentes conditions générales de vente (CGV) s\'appliquent à tous les vendeurs utilisant la plateforme papasow.',
        'En créant un compte vendeur, vous acceptez expressément ces conditions dans leur intégralité.',
        'papasow se réserve le droit de modifier ces conditions à tout moment, avec notification préalable aux vendeurs.'
      ]
    },
    {
      id: 'definitions',
      titre: 'Définitions',
      contenu: [
        '<strong>Plateforme :</strong> Le site web papasow et ses applications mobiles',
        '<strong>Vendeur :</strong> Toute personne physique ou morale vendant des produits via la plateforme',
        '<strong>Acheteur :</strong> Toute personne physique ou morale achetant des produits via la plateforme',
        '<strong>Produit :</strong> Tout bien ou service proposé à la vente sur la plateforme',
        '<strong>Commande :</strong> Toute demande d\'achat validée par un acheteur'
      ]
    },
    {
      id: 'inscription',
      titre: 'Inscription et compte vendeur',
      contenu: [
        'L\'inscription en tant que vendeur est gratuite et nécessite la création d\'un compte.',
        'Vous devez fournir des informations exactes et à jour lors de votre inscription.',
        'Vous êtes responsable de la confidentialité de vos identifiants de connexion.',
        'papasow se réserve le droit de refuser ou suspendre un compte vendeur à tout moment.',
        'Vous devez avoir la capacité juridique pour vendre les produits proposés.'
      ]
    },
    {
      id: 'produits',
      titre: 'Produits autorisés et interdits',
      contenu: [
        '<strong>Produits autorisés :</strong> Tous produits légaux conformes à la réglementation en vigueur',
        '<strong>Produits interdits :</strong>',
        '• Produits contrefaits ou illégaux',
        '• Produits dangereux ou toxiques',
        '• Produits pornographiques ou à caractère sexuel',
        '• Produits de contrefaçon de marques',
        '• Produits alimentaires sans autorisation sanitaire',
        '• Produits pharmaceutiques sans autorisation'
      ]
    },
    {
      id: 'prix',
      titre: 'Prix et commissions',
      contenu: [
        'Vous fixez librement le prix de vos produits, en tenant compte de la concurrence.',
        'papasow prélève une commission de 15% sur chaque vente réalisée.',
        'Les frais de livraison sont à votre charge sauf indication contraire.',
        'Les prix doivent être affichés TTC (Toutes Taxes Comprises).',
        'Vous vous engagez à ne pas pratiquer de prix abusifs ou discriminatoires.'
      ]
    },
    {
      id: 'stock',
      titre: 'Gestion des stocks',
      contenu: [
        'Vous devez maintenir des stocks suffisants pour honorer vos commandes.',
        'En cas de rupture de stock, vous devez immédiatement retirer le produit de la vente.',
        'Vous êtes responsable de la disponibilité réelle des produits proposés.',
        'papasow peut suspendre temporairement votre compte en cas de problèmes répétés de stock.'
      ]
    },
    {
      id: 'commandes',
      titre: 'Traitement des commandes',
      contenu: [
        'Vous devez traiter et expédier les commandes dans un délai maximum de 48h.',
        'Vous devez informer l\'acheteur en cas de retard ou de problème.',
        'Vous êtes responsable de la qualité et de la conformité des produits expédiés.',
        'Vous devez fournir un numéro de suivi pour chaque expédition.',
        'En cas de litige, papasow peut intervenir comme médiateur.'
      ]
    },
    {
      id: 'livraison',
      titre: 'Livraison et transport',
      contenu: [
        'Vous êtes responsable de l\'emballage et de la protection des produits.',
        'Vous devez choisir des transporteurs fiables et assurer les produits.',
        'Les frais de retour sont à votre charge en cas de produit défectueux.',
        'Vous devez respecter les délais de livraison annoncés.',
        'En cas de perte ou de dommage, vous devez rembourser l\'acheteur.'
      ]
    },
    {
      id: 'garantie',
      titre: 'Garantie et service après-vente',
      contenu: [
        'Vous devez respecter la garantie légale de conformité (2 ans).',
        'Vous devez fournir un service après-vente efficace.',
        'Les retours doivent être acceptés dans un délai de 14 jours.',
        'Vous devez rembourser ou échanger les produits défectueux.',
        'papasow peut intervenir en cas de litige persistant.'
      ]
    },
    {
      id: 'donnees',
      titre: 'Protection des données',
      contenu: [
        'Vous vous engagez à respecter le RGPD et la protection des données personnelles.',
        'Vous ne pouvez utiliser les données des acheteurs que pour la finalité de la vente.',
        'Vous devez sécuriser les données que vous collectez.',
        'Vous ne pouvez pas revendre ou partager les données des acheteurs.',
        'En cas de violation, votre compte peut être suspendu définitivement.'
      ]
    },
    {
      id: 'responsabilite',
      titre: 'Responsabilité',
      contenu: [
        'Vous êtes entièrement responsable de vos produits et de vos actions.',
        'papasow ne peut être tenu responsable des dommages causés par vos produits.',
        'Vous devez souscrire une assurance responsabilité civile professionnelle.',
        'Vous vous engagez à indemniser papasow en cas de préjudice.',
        'En cas de litige, le droit français s\'applique exclusivement.'
      ]
    },
    {
      id: 'resiliation',
      titre: 'Résiliation',
      contenu: [
        'Vous pouvez résilier votre compte vendeur à tout moment avec un préavis de 30 jours.',
        'papasow peut résilier votre compte en cas de violation des présentes conditions.',
        'En cas de résiliation, vous devez honorer les commandes en cours.',
        'Vos données seront conservées conformément à la réglementation.',
        'La résiliation n\'entraîne pas le remboursement des commissions déjà prélevées.'
      ]
    },
    {
      id: 'droit',
      titre: 'Droit applicable et juridiction',
      contenu: [
        'Les présentes conditions sont régies par le droit français.',
        'En cas de litige, les tribunaux français sont seuls compétents.',
        'La nullité d\'une clause n\'entraîne pas la nullité de l\'ensemble du contrat.',
        'Les parties s\'engagent à rechercher une solution amiable avant tout recours judiciaire.',
        'En cas de modification de la réglementation, ces conditions seront adaptées en conséquence.'
      ]
    }
  ];

  return (
    <>
      <Header />
      <div className="container-fluid py-4" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* En-tête */}
            <div className="text-center mb-5">
              <h1 className="mb-3 text-primary fw-bold">
                <i className="bi bi-file-text me-3"></i>
                Conditions Générales de Vente
              </h1>
              <p className="lead text-muted">Conditions applicables aux vendeurs de la plateforme papasow</p>
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

            {/* Contenu des conditions */}
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
                      <h5 className="fw-bold">Pour papasow :</h5>
                      <p className="small text-muted">
                        papasow SARL<br/>
                        Siège social : Conakry, Guinée<br/>
                        Email : legal@papasow.com<br/>
                        Téléphone : +224 XXX XXX XXX
                      </p>
                    </div>
                    <div className="col-md-6">
                      <h5 className="fw-bold">Acceptation :</h5>
                      <p className="small text-muted">
                        En cochant la case "J'accepte les conditions générales de vente", 
                        vous reconnaissez avoir lu, compris et accepté l'intégralité de ces conditions.
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