export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  devices: Record<string, Device>;
}

export interface Device {
  deviceId: string;
  deviceName: string;
  status: string;
  doors: Record<string, Door>;
  access_history: AccessHistory[];
}

export interface Door {
  assignees: Assignee[];
}

export interface Assignee {
  assigneeName: string;
  nfcId: string;
  virtualPin: string;
  role: string;
  accessType: string;
}

export interface AccessHistory {
  timestamp: string;
  assigneeName: string;
  doorName: string;
  status: string;
}

export interface AuthTokens {
  AccessToken: string;
  IdToken: string;
  RefreshToken: string;
  ExpiresIn: number;
  TokenType: string;
}
