import seed from './seed';

export default function generatePIS(nomask: boolean): string {
  let pis = seed(10);

  const multiplicadorBase = '3298765432';
  let total = 0;
  let resto = 0;
  let multiplicando = 0;
  let multiplicador = 0;

  for (let i = 0; i < 10; i++) {
    multiplicando = parseInt(pis.substring(i, i + 1));
    multiplicador = parseInt(multiplicadorBase.substring(i, i + 1));
    total += multiplicando * multiplicador;
  }

  resto = 11 - (total % 11);
  resto = resto === 10 || resto === 11 ? 0 : resto;
  pis += String(resto);
  pis += parseInt('' + pis.charAt(10));

  return nomask ? pis : pis.substr(0, 3) + '.' + pis.substr(3, 4) + '.' + pis.substr(7, 3) + '-' + pis.substr(10, 1);
}
