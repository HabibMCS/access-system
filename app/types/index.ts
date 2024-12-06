export interface DevicePermissions {
    cardAccess: boolean;
    pinAccess: boolean;
    biometric: boolean;
    scheduling: boolean;
  }
  
  export interface DeviceFeatures {
    antiPassback: boolean;
    timeZones: boolean;
    visitorManagement: boolean;
  }
  
  export interface DeviceEvent {
    id: number;
    timestamp: string;
    type: string;
    user: string;
    details: string;
  }
  
  export interface Device {
    id: number;
    name: string;
    type: string;
    status: string;
    permissions: DevicePermissions;
    features: DeviceFeatures;
    events: DeviceEvent[];
  }
  
  export interface NewDevice {
    name: string;
    type: string;
    permissions: DevicePermissions;
    features: DeviceFeatures;
  }