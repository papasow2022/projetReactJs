import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Configuration du transporteur email
const createTransporter = () => {
  console.log('🔧 Configuration email:', {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? '***configuré***' : 'NON CONFIGURÉ'
  });
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Générer un token JWT
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-for-papasow-admin-2024';
  return jwt.sign({ userId }, secret, {
    expiresIn: '7d' // 7 jours au lieu de 24h
  });
};

// Inscription d'un nouvel utilisateur
export const register = async (req, res) => {
  try {
    // Vérifier les erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { email, password, prenom, nom, phone, birthDate, gender, newsletter } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Un compte avec cet email existe déjà'
      });
    }

    // Créer le nouvel utilisateur
    const user = new User({
      email,
      password,
      prenom,
      nom,
      phone,
      birthDate,
      gender,
      newsletter
    });

    // Générer le code de vérification
    const verificationCode = user.generateVerificationCode();
    
    // Sauvegarder l'utilisateur
    await user.save();

    // Envoyer l'email de confirmation
    try {
      console.log('📧 Tentative d\'envoi d\'email à:', email);
      console.log('🔑 Code de vérification généré:', verificationCode);
      
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🔐 Code de confirmation - PapasowCool_aide',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e47911; font-size: 28px;">🔐 PapasowCool_aide</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #232f3e; margin-bottom: 20px;">Bienvenue ${prenom} !</h2>
              
              <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
                <strong>Votre inscription a été créée avec succès !</strong><br><br>
                Merci de vous être inscrit sur PapasowCool_aide. Pour finaliser votre inscription et activer votre compte, 
                <strong>saisissez le code de confirmation ci-dessous dans la fenêtre qui s'est ouverte</strong> :
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #e47911; color: white; font-size: 36px; font-weight: bold; 
                           padding: 25px; border-radius: 12px; letter-spacing: 8px; display: inline-block;
                           box-shadow: 0 4px 15px rgba(228, 121, 17, 0.3);">
                  ${verificationCode}
                </div>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="color: #856404; font-size: 14px; margin: 0;">
                  <strong>⚠️ Important :</strong> Ce code expire dans 15 minutes. 
                  Si vous ne l'utilisez pas à temps, vous pourrez demander un nouveau code.
                </p>
              </div>
              
              <p style="color: #6c757d; font-size: 14px; text-align: center;">
                <strong>Instructions :</strong> Retournez sur la page d'inscription et saisissez ce code dans la fenêtre de vérification qui s'est ouverte.
              </p>
            </div>
            
            <div style="text-align: center; color: #6c757d; font-size: 14px;">
              <p>Si vous n'avez pas créé de compte sur PapasowCool_aide, ignorez cet email.</p>
              <p>© 2024 PapasowCool_aide. Tous droits réservés.</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✅ Email envoyé avec succès à:', email);
      
      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès. Un code de confirmation a été envoyé à votre adresse email.',
        userId: user._id
      });
      
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError);
      console.error('Détails de l\'erreur:', {
        message: emailError.message,
        code: emailError.code,
        response: emailError.response
      });
      
      // Même si l'email échoue, on garde l'utilisateur créé
      res.status(201).json({
        success: true,
        message: 'Compte créé avec succès. Erreur lors de l\'envoi de l\'email de confirmation.',
        userId: user._id,
        warning: 'Veuillez contacter le support pour obtenir votre code de confirmation.',
        debugCode: verificationCode // Pour debug en cas d'erreur email
      });
    }

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

// Vérification du code de confirmation
export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Email et code de confirmation requis'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email déjà vérifié'
      });
    }

    if (!user.verifyCode(code)) {
      return res.status(400).json({
        success: false,
        message: 'Code de confirmation invalide ou expiré'
      });
    }

    // Marquer l'email comme vérifié
    user.clearVerificationCode();
    await user.save();

    // Générer un token JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Email vérifié avec succès',
      token,
      user: {
        id: user._id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
        roles: user.roles,
        isVendor: user.isVendor,
        isVendorValidated: user.isVendorValidated,
        vendorStatus: user.vendorStatus
      }
    });

  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la vérification'
    });
  }
};

// Renvoyer le code de confirmation
export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email requis'
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email déjà vérifié'
      });
    }

    // Générer un nouveau code
    const verificationCode = user.generateVerificationCode();
    await user.save();

    // Envoyer le nouvel email
    try {
      const transporter = createTransporter();
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Nouveau code de confirmation - PapasowCool_aide',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e47911; font-size: 28px;">PapasowCool_aide</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 20px;">
              <h2 style="color: #232f3e; margin-bottom: 20px;">Nouveau code de confirmation</h2>
              
              <p style="color: #6c757d; font-size: 16px; line-height: 1.6;">
                Voici votre nouveau code de confirmation pour activer votre compte :
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <div style="background-color: #e47911; color: white; font-size: 32px; font-weight: bold; 
                           padding: 20px; border-radius: 8px; letter-spacing: 5px; display: inline-block;">
                  ${verificationCode}
                </div>
              </div>
              
              <p style="color: #6c757d; font-size: 14px; text-align: center;">
                Ce code expire dans 15 minutes.
              </p>
            </div>
            
            <div style="text-align: center; color: #6c757d; font-size: 14px;">
              <p>Si vous n'avez pas demandé ce code, ignorez cet email.</p>
              <p>© 2024 PapasowCool_aide. Tous droits réservés.</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      
      res.status(200).json({
        success: true,
        message: 'Nouveau code de confirmation envoyé'
      });
      
    } catch (emailError) {
      console.error('Erreur envoi email:', emailError);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'envoi de l\'email'
      });
    }

  } catch (error) {
    console.error('Erreur lors du renvoi du code:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Connexion
export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Données invalides',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }

    // Vérifier si l'email est vérifié
    if (!user.isEmailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Veuillez vérifier votre email avant de vous connecter',
        needsVerification: true,
        email: user.email
      });
    }

    // Générer un token JWT
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token,
      user: {
        id: user._id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        phone: user.phone,
        birthDate: user.birthDate,
        gender: user.gender,
        newsletter: user.newsletter,
        isEmailVerified: user.isEmailVerified,
        isAdmin: user.isAdmin,
        roles: user.roles,
        isVendor: user.isVendor,
        isVendorValidated: user.isVendorValidated,
        vendorStatus: user.vendorStatus
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
};

// Vérifier le token (middleware)
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token d\'accès requis'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token invalide'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token invalide'
    });
  }
};
