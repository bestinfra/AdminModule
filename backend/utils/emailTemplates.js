import { readFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function getLoginCredentialsEmailHtml({ username, password }) {
  const templatePath = join(__dirname, '../templates/email/loginCredentials.html');
  let html = await readFile(templatePath, 'utf-8');
  html = html.replace('{username}', username).replace('{password}', password);
  return html;
} 