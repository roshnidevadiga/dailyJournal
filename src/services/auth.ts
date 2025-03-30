// Secure authentication service using password hashing
import CryptoJS from 'crypto-js';

export interface User {
  isAuthenticated: boolean;
  username: string;
}

// Your pre-computed password hash (generated with SHA-256)
// This is a hash of the password "admin123" with salt "dailyjournal"
// You should generate your own secure password and hash
const SECURE_PASSWORD_HASH = "5189c2a165e17ff15a67b64d585476859330c3a3a46d1e7c2e8ec250ee1c529f";

// This salt adds extra security and should be unique to your app
const PASSWORD_SALT = "dailyjournal";

// Your desired username
const ADMIN_USERNAME = "admin";

// Check if user is already logged in
export function getAuthUser(): User | null {
  try {
    const userData = localStorage.getItem('auth_user');
    if (!userData) return null;
    
    const user = JSON.parse(userData) as User;
    return user.isAuthenticated ? user : null;
  } catch (error) {
    console.error('Error getting auth user:', error);
    return null;
  }
}

// Hash a password with our salt
function hashPassword(password: string): string {
  return CryptoJS.SHA256(password + PASSWORD_SALT).toString();
}

// Validate username and password against stored hash
export async function login(username: string, password: string): Promise<User> {
  // Simulate a slight delay like an API call would have
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Hash the provided password
  const passwordHash = hashPassword(password);
  
  // Check credentials
  if (username === ADMIN_USERNAME && passwordHash === SECURE_PASSWORD_HASH) {
    const user: User = {
      isAuthenticated: true,
      username: username
    };
    
    // Save user in localStorage
    localStorage.setItem('auth_user', JSON.stringify(user));
    return user;
  } else {
    throw new Error('Invalid username or password');
  }
}

// Sign out the user
export function logout(): void {
  localStorage.removeItem('auth_user');
}

// Helper function to generate a hash for a new password (for development use)
export function generatePasswordHash(password: string): string {
  return hashPassword(password);
}
