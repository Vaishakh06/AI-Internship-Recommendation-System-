const DEFAULT_AVATAR_URL =
  "https://res.cloudinary.com/dozdj2yha/image/upload/v1748200329/blank-profile-picture_tlmavs.webp";

const MAX_GENERAL_MESSAGES = 500;

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
  sameSite: "none",
};

const ACCESS_TOKEN_OPTIONS = {
  expiresIn: "15m", // token expires in 15 minutes
};

const REFRESH_TOKEN_OPTIONS = {
  expiresIn: "7d", // token expires in one week
};

module.exports = {
  DEFAULT_AVATAR_URL,
  MAX_GENERAL_MESSAGES,
  COOKIE_OPTIONS,
  ACCESS_TOKEN_OPTIONS,
  REFRESH_TOKEN_OPTIONS,
};