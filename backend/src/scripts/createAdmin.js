import { authService } from '../auth/authService.js';
import { initDB } from '../db/index.js';

const createAdminUser = async () => {
  try {
    await initDB();
    
    const admin = await authService.register('admin', 'password', 'admin');
    console.log('Admin user created:', admin);
    
    process.exit(0);
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('Admin user already exists');
    } else {
      console.error('Error creating admin user:', error);
    }
    process.exit(1);
  }
};

createAdminUser();