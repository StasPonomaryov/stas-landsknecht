/**
 * Prepare user name from email to dusplay
 * @param email 
 * @returns 
 */
export const getUsername = (email: string) => {
  const userName = email;
  let displayName = email;
  const firstDot = userName.split('.');
  const fromMail = userName.split('@');

  if (firstDot.length && !firstDot.includes('@')) {
    displayName = firstDot[0];
  } else if (fromMail.length) {
    displayName = fromMail[0];
  }

  return displayName;
}