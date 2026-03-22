import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green' }}
        text1Style={{
          fontSize: 14,
          fontWeight: '600',
          width: '100%',
        }}
      />
    ),
  
    error: (props: any) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 14,
          width: '100%',
        }}
      />
    ),
  };