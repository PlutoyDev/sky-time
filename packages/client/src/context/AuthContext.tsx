import { createContext, Dispatch, SetStateAction, useState } from 'react';
// import type { User, Guild } from "@sky-time/prisma";

//Temp Substitute
type User = any;
type Guild = any;

type PubicUser = Omit<User, 'accessToken' | 'refreshToken' | 'expiresAt'>;

type AuthContextValue = {
  user?: PubicUser;
  guild?: Guild;
  setUser?: Dispatch<SetStateAction<PubicUser | undefined>>;
  setGuild?: Dispatch<SetStateAction<Guild | undefined>>;
  setAccessToken?: Dispatch<SetStateAction<string | undefined>>;
};

type AuthProviderProps = {
  children: React.ReactNode;
  setAccessToken: Dispatch<SetStateAction<string | undefined>>;
};

export const AuthContext = createContext<AuthContextValue>({});

export const AuthProvider = ({ children, setAccessToken }: AuthProviderProps) => {
  const [user, setUser] = useState<PubicUser>();
  const [guild, setGuild] = useState<Guild>();

  //prettier-ignore
  const value: AuthContextValue = {
    user, setUser,
    guild, setGuild,
    setAccessToken
  };

  return <AuthContext.Provider value={value} children={children} />;
};

export default AuthContext;
