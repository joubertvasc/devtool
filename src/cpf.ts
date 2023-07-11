import seed from './seed';

export default function generateCPF(nomask: boolean): string {
  let cpf = seed(9);
  let add = 0;

  for (let i = 0; i < 9; i++) {
    add += parseInt(cpf.charAt(i)) * (10 - i);
  }

  let rev = 11 - (add % 11);

  if (rev === 10 || rev === 11) {
    rev = 0;
  }

  cpf += rev;

  // Valida 2o digito
  add = 0;

  for (let i = 0; i < 10; i++) {
    add += parseInt(cpf.charAt(i)) * (11 - i);
  }

  rev = 11 - (add % 11);

  if (rev === 10 || rev === 11) {
    rev = 0;
  }

  cpf += rev;

  return nomask ? cpf : cpf.substr(0, 3) + '.' + cpf.substr(3, 3) + '.' + cpf.substr(6, 3) + '-' + cpf.substr(9, 2);
}
