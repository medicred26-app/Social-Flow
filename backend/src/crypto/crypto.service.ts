import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

@Injectable()
export class CryptoService {
  constructor(private readonly config: ConfigService) {}

  private getKey() {
    const hex = this.config.get<string>('TOKEN_ENCRYPTION_KEY');
    if (!hex || hex.length !== 64) {
      throw new Error('TOKEN_ENCRYPTION_KEY must be 32 bytes as 64 hex characters.');
    }
    return Buffer.from(hex, 'hex');
  }

  encryptSecret(plain: string) {
    const iv = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.getKey(), iv);
    const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
  }

  decryptSecret(payload: string) {
    const [ivHex, tagHex, dataHex] = payload.split(':');
    if (!ivHex || !tagHex || !dataHex) {
      throw new Error('Encrypted token is malformed.');
    }
    const decipher = createDecipheriv('aes-256-gcm', this.getKey(), Buffer.from(ivHex, 'hex'));
    decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
    return Buffer.concat([
      decipher.update(Buffer.from(dataHex, 'hex')),
      decipher.final(),
    ]).toString('utf8');
  }
}
