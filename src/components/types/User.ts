export interface User {
  uid: string;
  displayName: string;
  email: string;
  metadata?: {
    creationTime?: string;
    lastSignInTime?: string;
  };
}
