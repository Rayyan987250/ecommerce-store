declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      email: string;
      name: string;
      isAdmin: boolean;
    }

    interface Request {
      user?: AuthUser;
      requestId?: string;
    }
  }
}

export {};
