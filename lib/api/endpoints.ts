export const API = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        UPDATEPROFILE: "/api/auth/update",
        REQUEST_PASSWORD_RESET: '/api/auth/request-password-reset',
        RESET_PASSWORD: (token: string) => `/api/auth/reset-password/${token}`,
    }
    ,ADMIN: {
    USER: {
      CREATE: "/api/admin/",
      GETALL: "/api/admin/users",
            GET_ONE: (userId: string) => `/api/admin/users/${userId}`,
            UPDATE: (email: string) => `/api/admin/users/${email}`,
            DELETE: (userId: string) => `/api/admin/users/${userId}`,
    
    },
  },
}