import generatePassword from './password';
import generateCNPJ from './cnpj';
import generateCPF from './cpf';
import generatePIS from './pis';

interface Param {
  option: string;
  value?: string;
}

let cmd = '';
let noMask = false;
let passwordLength = 8;
let passwordComplexity = 'a';

process.argv.forEach(function (val, index, array) {
  val = val.toLowerCase().trim();

  if (
    val === 'cpf' ||
    val === 'cnpj' ||
    val === 'pis' ||
    val === 'pasep' ||
    val === 'nis' ||
    val === 'help' ||
    val === 'passwd'
  ) {
    cmd = val;
  }

  if (val === '-nm' || val === '--nomask') {
    noMask = true;
  }

  if (val.startsWith('-l=') || val.startsWith('--length=')) {
    const temp = val.split('=');
    if (temp.length > 1 && !isNaN(parseInt(temp[1]))) {
      passwordLength = parseInt(temp[1]);
    }
  }

  if (val.startsWith('-c=')) {
    const temp = val.split('=');

    if (temp.length > 1 && (temp[1] === 'b' || temp[1] === 'a' || temp[1] === 'p')) {
      passwordComplexity = temp[1];
    }
  }
});

setTimeout(async () => {
  if (cmd === 'help' || cmd === '') {
    console.log(`JV DevTools V1.0 - Utilize:`);
    console.log(` `);
    console.log(`Comandos:`);
    console.log(` `);
    console.log(`cpf                 - Gerar um CPF aleatório`);
    console.log(`cnpj                - Gerar um CNPJ aleatório`);
    console.log(`pis                 - Gerar um PIS/PASEP/NIS aleatório`);
    console.log(`pasep               - Mesmo que PIS`);
    console.log(`nis                 - Mesmo que PIS`);
    console.log(`passwd              - Gerar uma senha aleatória de 8 dígitos com letras e números`);
    console.log(`passwd -l -c        - Gerar uma senha aleatória de dígitos dígitos e complexidades diversas`);
    console.log(`help                - Exibe essas instruções`);
    console.log(` `);
    console.log(`Opções`);
    console.log(` `);
    console.log(`-nm ou --nomask     - Gerar sem a máscara`);
    console.log(`-l=n ou --length=n  - Tamanho da senha a ser gerada`);
    console.log(`-c=B/A/P            - Complexidade da senha a ser gerada: Baixa, Alta, Paranóia`);
  } else {
    if (cmd === 'cpf') console.log(generateCPF(noMask));
    if (cmd === 'cnpj') console.log(generateCNPJ(noMask));
    if (cmd === 'pis' || cmd === 'pasep' || cmd === 'nis') console.log(generatePIS(noMask));
    if (cmd === 'passwd') console.log(generatePassword(passwordLength, passwordComplexity));
  }

  process.exit();
}, 1000);
