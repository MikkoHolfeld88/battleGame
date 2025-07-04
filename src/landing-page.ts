import { auth, googleProvider } from './firebaseConfig';
import {
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';

// DOM Elements
const loginGoogleBtn = document.getElementById('login-google-btn');
const loginEmailBtn = document.getElementById('login-email-btn'); // This might open a modal
const logoutBtn = document.getElementById('logout-btn');
const userInfoDisplay = document.getElementById('user-info');
const userDisplayName = document.getElementById('user-display-name');

// --- UI Update Functions ---
function showLoggedInUI(user: User) {
  if (userInfoDisplay && userDisplayName && loginGoogleBtn && loginEmailBtn && logoutBtn) {
    userDisplayName.textContent = user.displayName || user.email || 'User';
    userInfoDisplay.style.display = 'block';
    loginGoogleBtn.style.display = 'none';
    loginEmailBtn.style.display = 'none';
    logoutBtn.style.display = 'block'; // Assuming logout button is part of user-info li or similar
  }
  console.log('User logged in:', user.uid);
}

function showLoggedOutUI() {
  if (userInfoDisplay && userDisplayName && loginGoogleBtn && loginEmailBtn && logoutBtn) {
    userDisplayName.textContent = '';
    userInfoDisplay.style.display = 'none';
    loginGoogleBtn.style.display = 'block';
    loginEmailBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
  }
  console.log('User logged out');
}

// --- Authentication Event Listener ---
onAuthStateChanged(auth, (user) => {
  if (user) {
    showLoggedInUI(user);
  } else {
    showLoggedOutUI();
  }
});

// --- Google Sign-In ---
loginGoogleBtn?.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken;
    // The signed-in user info.
    // const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
    console.log('Google sign-in successful', result.user);
    // UI update will be handled by onAuthStateChanged
  } catch (error: any) {
    console.error('Google sign-in error:', error);
    alert(`Google Sign-In Error: ${error.message}`);
  }
});

// --- Email/Password Sign-In/Sign-Up (Basic Implementation - requires UI for email/password input) ---
// This is a placeholder for functionality. Typically, you'd have a modal or separate form fields.
loginEmailBtn?.addEventListener('click', () => {
  const email = prompt("Enter your email:");
  const password = prompt("Enter your password (leave blank to create a new account with this email, or enter password to login):");

  if (email && password) {
    // Try to sign in first
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        console.log('Email sign-in successful', userCredential.user);
        // UI update will be handled by onAuthStateChanged
      })
      .catch((error) => {
        // If sign-in fails, and it's a "user not found" error, offer to create account
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          if (confirm("User not found or invalid password. Would you like to create a new account with this email and password?")) {
            createUserWithEmailAndPassword(auth, email, password)
              .then((userCredential) => {
                // Signed up
                console.log('Email sign-up successful', userCredential.user);
                // UI update will be handled by onAuthStateChanged
              })
              .catch((signUpError: any) => {
                console.error('Email sign-up error:', signUpError);
                alert(`Sign-Up Error: ${signUpError.message}`);
              });
          }
        } else if (error.code === 'auth/wrong-password') {
            alert('Incorrect password. Please try again.');
        } else {
          console.error('Email sign-in error:', error);
          alert(`Sign-In Error: ${error.message}`);
        }
      });
  } else if (email) { // Only email provided, assume sign-up attempt if password was intentionally left blank
      const newPassword = prompt("Create a password for your new account:");
      if (newPassword) {
        createUserWithEmailAndPassword(auth, email, newPassword)
        .then((userCredential) => {
            console.log('Email sign-up successful (no initial password provided):', userCredential.user);
        })
        .catch((signUpError: any) => {
            console.error('Email sign-up error (no initial password):', signUpError);
            alert(`Sign-Up Error: ${signUpError.message}`);
        });
      } else {
        alert("Password cannot be empty for a new account.");
      }
  } else {
    alert("Email and password are required.");
  }
});

// --- Logout ---
logoutBtn?.addEventListener('click', async () => {
  try {
    await signOut(auth);
    console.log('Logout successful');
    // UI update will be handled by onAuthStateChanged
  } catch (error: any) {
    console.error('Logout error:', error);
    alert(`Logout Error: ${error.message}`);
  }
});

console.log('Landing page script loaded.');

// Ensure the DOM is fully loaded before trying to attach event listeners,
// though with `type="module"` scripts are deferred by default.
// However, direct element access might still benefit from this.
document.addEventListener('DOMContentLoaded', () => {
    // Re-check elements in case the script ran before full DOM parsing
    // This is mostly a safeguard; usually not needed with module scripts in body.
    if (!loginGoogleBtn) console.error("Google login button not found after DOMContentLoaded");
    if (!loginEmailBtn) console.error("Email login button not found after DOMContentLoaded");
    // ... etc. for other elements
});
