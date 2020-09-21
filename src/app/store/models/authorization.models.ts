export interface User {
    email: string;
    password: string;
    returnSecureToken?: boolean;
}
export interface FirebaseAuthorizationResponse {
    idToken: string;
    expiresIn: string;
    localId: string;
}