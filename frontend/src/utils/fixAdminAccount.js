// Script pour créer/corriger le compte admin
export const fixAdminAccount = () => {
  try {
    // Récupérer la liste des utilisateurs
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => u.email === 'sowdian57@gmail.com');
    
    // Créer ou mettre à jour le compte admin
    const adminUser = {
      email: 'sowdian57@gmail.com',
      password: 'papasow2022',
      prenom: 'Admin',
      nom: 'Sow',
      phone: '+221 77 123 45 67',
      birthDate: '1990-01-01',
      gender: 'male',
      newsletter: true,
      isAdmin: true,
      roles: ['superadmin'],
      isVendor: false,
      isVendorValidated: false,
      vendorId: null,
      vendorStatus: 'none'
    };
    
    if (userIndex !== -1) {
      // Mettre à jour l'utilisateur existant
      users[userIndex] = { ...users[userIndex], ...adminUser };
      console.log('✅ Compte admin mis à jour:', users[userIndex]);
    } else {
      // Créer un nouvel utilisateur admin
      users.push(adminUser);
      console.log('✅ Nouveau compte admin créé:', adminUser);
    }
    
    // Créer un utilisateur moderator pour les tests
    const moderatorUser = {
      email: 'moderator@test.com',
      password: 'moderator123',
      prenom: 'Moderator',
      nom: 'Test',
      phone: '+221 77 123 45 68',
      birthDate: '1990-01-01',
      gender: 'male',
      newsletter: true,
      isAdmin: true,
      roles: ['moderator'],
      isVendor: false,
      isVendorValidated: false,
      vendorId: null,
      vendorStatus: 'none'
    };
    
    // Vérifier si le moderator existe déjà
    const moderatorIndex = users.findIndex(u => u.email === 'moderator@test.com');
    if (moderatorIndex !== -1) {
      users[moderatorIndex] = moderatorUser;
      console.log('✅ Moderator mis à jour:', moderatorUser);
    } else {
      users.push(moderatorUser);
      console.log('✅ Moderator créé:', moderatorUser);
    }

    // Créer un utilisateur finance pour les tests
    const financeUser = {
      email: 'finance@test.com',
      password: 'finance123',
      prenom: 'Finance',
      nom: 'Manager',
      phone: '+221 77 123 45 69',
      birthDate: '1985-05-15',
      gender: 'female',
      newsletter: true,
      isAdmin: true,
      roles: ['finance'],
      isVendor: false,
      isVendorValidated: false,
      vendorId: null,
      vendorStatus: 'none'
    };
    
    // Vérifier si le finance existe déjà
    const financeIndex = users.findIndex(u => u.email === 'finance@test.com');
    if (financeIndex !== -1) {
      users[financeIndex] = financeUser;
      console.log('✅ Finance mis à jour:', financeUser);
    } else {
      users.push(financeUser);
      console.log('✅ Finance créé:', financeUser);
    }
    
    // Sauvegarder la liste des utilisateurs
    localStorage.setItem('users', JSON.stringify(users));
    
    // Vérifier si l'utilisateur actuel est connecté
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      
      // Si c'est sowdian57@gmail.com, lui donner les droits admin
      if (userData.email === 'sowdian57@gmail.com') {
        userData.isAdmin = true;
        userData.roles = ['superadmin'];
        userData.isLoggedIn = true;
        userData.loginTime = new Date().toISOString();
        
        // Sauvegarder les modifications
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('✅ Session admin mise à jour:', userData);
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de la création/mise à jour du compte admin:', error);
    return false;
  }
};

// Exécuter automatiquement
fixAdminAccount();