import { generateKeyPairSync } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { input, select } from '@inquirer/prompts';
import { AbstractGenerator, GeneratorOptions } from '../abstract-generator';

export class Generator extends AbstractGenerator {
  options(): GeneratorOptions {
    return {
      title: 'Criar Chave Assimétrica',
      name: 'KEY_PAIR',
    };
  }

  async generate() {
    const filename = await input({
      message: 'Qual o nome do arquivo?',
      required: true,
    });
    const answer = await select({
      message: 'Qual o tamanho da chave?',
      choices: [
        {
          value: 1024,
        },
        {
          value: 2048,
        },
        {
          value: 4096,
        },
      ],
    });
    this.createKeyPair(filename, answer);
  }

  private createKeyPair(filename: string, keyPairLength: number) {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: keyPairLength,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    const keyPairPath = path.join(process.cwd(), 'key-pair');
    fs.mkdirSync(keyPairPath);
    fs.writeFileSync(
      path.join(keyPairPath, `${filename}-private.key`),
      privateKey,
    );
    fs.writeFileSync(
      path.join(keyPairPath, `${filename}-public.key`),
      publicKey,
    );

    console.log('Chaves geradas com sucesso');
  }
}
