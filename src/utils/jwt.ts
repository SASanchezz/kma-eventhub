import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import moment from 'moment';
import { TokensPairDto } from 'src/modules/auth/dto/token-pair.dto';

export interface UserSession {
  userId: number;
}

export const createToken = (payload: UserSession): string => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: 'HS256', expiresIn: process.env.TOKEN_LIFE });
};

export const decodeToken = (token: string): UserSession | null => {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ['HS256'],
      ignoreExpiration: true,
      complete: false,
    }) as UserSession;
  } catch (e) {
    return null;
  }
};

export const createRefreshToken = (token: string): string => {
  return crypto.randomBytes(64).toString('base64') + token.slice(-6);
};

export const createTokensPair = (userSession: UserSession): TokensPairDto => {
  const token = createToken(userSession);
  const refreshToken = createRefreshToken(token);

  return {
    token,
    refreshToken,
  };
};

export const getTokenFromRequest = (req: any): string => {
  return req.header('authorization')?.split(' ')[1] ?? '';
};

export const validateRefreshToken = (
  token: string,
  refreshToken: string | null,
  issuedAt: string | null,
): boolean => {
  if (!refreshToken || !issuedAt) {
    return false;
  }

  if (refreshToken.slice(-6) !== token.slice(-6)) {
    return false;
  }

  if (moment(issuedAt).add(process.env.REFRESH_TOKEN_LIFE, 'seconds').diff(moment()) < 0) {
    return false;
  }
  return true;
};
