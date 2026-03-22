import { createNavigationContainerRef } from '@react-navigation/native';
import { ROOT_PARAM_LIST } from '../models/navigation';

export const navigationRef = createNavigationContainerRef<ROOT_PARAM_LIST>();

export function navigate(name: keyof ROOT_PARAM_LIST, params?: any) {
  if (navigationRef.isReady()) {
    // @ts-ignore
    navigationRef.navigate(name, params);
  }
}

export function reset() {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  }
}