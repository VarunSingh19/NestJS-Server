import { readFileSync, existsSync } from 'fs';

/**
 * Reads a Docker secret from /run/secrets/ or falls back to env var.
 *
 * Usage:
 *   getSecret('JWT_SECRET')
 *   → checks JWT_SECRET_FILE env → reads file → falls back to JWT_SECRET env
 */
export function getSecret(name: string): string {
  const filePath = process.env[`${name}_FILE`];

  if (filePath && existsSync(filePath)) {
    return readFileSync(filePath, 'utf8').trim();
  }

  return process.env[name] ?? '';
}
