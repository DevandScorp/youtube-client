export interface YoutubeElement {
  name: string;
  creation_date: Date;
  view_count: number;
  like_count: number;
  dislike_count: number;
  comment_count: number;
  image_url: string;
}

export type AlertType = 'success' | 'error';
export interface Alert {
  type: AlertType;
  text: string;
}
export interface User {
  email: string;
  password: string;
  returnSecureToken?: boolean;
}
export interface FirebaseAuthorizationResponse {
  idToken: string;
  expiresIn: string;
}
