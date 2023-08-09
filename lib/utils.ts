import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function decodeBase64URL(value: string) {
  try {
    // atob is present in all browsers and nodejs >= 16
    // but if it is not it will throw a ReferenceError in which case we can try to use Buffer
    // replace are here to convert the Base64-URL into Base64 which is what atob supports
    // replace with //g regex acts like replaceAll
    // Decoding base64 to UTF8 see https://stackoverflow.com/a/30106551/17622044
    return decodeURIComponent(
      atob(value.replace(/[-]/g, '+').replace(/[_]/g, '/'))
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
  } catch (e) {
    if (e instanceof ReferenceError) {
      // running on nodejs < 16
      // Buffer supports Base64-URL transparently
      return Buffer.from(value, 'base64').toString('utf-8');
    } else {
      throw e;
    }
  }
}

// Taken from: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
export function decodeJWTPayload(token: string) {
  const parts = token.split('.');

  if (parts.length !== 3) {
    throw new Error('JWT is not valid: not a JWT structure');
  }

  const base64Url = parts[1];
  return JSON.parse(decodeBase64URL(base64Url));
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string) {
  const names = name.split(' ');
  const firstName = names[0];
  const lastName = names[names.length - 1];

  return firstName.charAt(0) + lastName.charAt(0);
}

export function sentenceCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value);
}
