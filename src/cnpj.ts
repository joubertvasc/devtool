import seed from './seed';

export default function generateCNPJ(nomask: boolean): string {
  let cnpj = seed(12);
  let cnpjSize = cnpj.length;
  let cnpjNumbers = cnpj;

  let sum = 0;
  let pos = cnpjSize - 7;

  for (let i = cnpjSize; i >= 1; i--) {
    sum += Number(cnpjNumbers.charAt(cnpjSize - i)) * pos--;

    if (pos < 2) {
      pos = 9;
    }
  }

  const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  cnpjSize = cnpjSize + 1;
  cnpjNumbers = cnpj + String(digit1);
  sum = 0;
  pos = cnpjSize - 7;

  for (let i = cnpjSize; i >= 1; i--) {
    sum += Number(cnpjNumbers.charAt(cnpjSize - i)) * pos--;

    if (pos < 2) {
      pos = 9;
    }
  }

  const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  cnpj += String(digit1) + String(digit2);

  return nomask
    ? cnpj
    : cnpj.substr(0, 2) +
        '.' +
        cnpj.substr(2, 3) +
        '.' +
        cnpj.substr(5, 3) +
        '/' +
        cnpj.substr(8, 4) +
        '-' +
        cnpj.substr(12, 2);
}
