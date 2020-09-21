
export type AlertType = 'success' | 'error';
export interface Alert {
  type: AlertType;
  text: string;
}

export interface HistoryElement {
  query: string;
  localId: string;
}
