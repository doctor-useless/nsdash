import netlifyIdentity from 'netlify-identity-widget'
const currentUserStorageKey = "currentNSDashUser"

export function loginUser() {
  if (netlifyIdentity && netlifyIdentity.currentUser()) {
    const {
      app_metadata, created_at, confirmed_at, email, id, user_metadata
    } = netlifyIdentity.currentUser();

    localStorage.setItem(
      currentUserStorageKey,
      JSON.stringify({...app_metadata, created_at, confirmed_at, email, id, ...user_metadata})
    );
  }
}

export function logoutUser() {
  localStorage.removeItem(currentUserStorageKey)
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(currentUserStorageKey)) || null
}