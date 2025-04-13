// src/api/auth.ts

export const getToken = (): string | null => {
    return sessionStorage.getItem('token');
  };
  
  export const saveToken = (token: string): void => {
    sessionStorage.setItem('token', token);
  };
  
  export const clearToken = (): void => {
    sessionStorage.removeItem('token');
  };
  