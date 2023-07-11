export default function generatePassword(length: number, complexity: string): string {
  const options: any = {
    length,
    numbers: true,
    uppercase: false,
    lowercase: false,
    exclude: '&^%_?',
    strict: true,
  };

  if (complexity === 'a') {
    options.uppercase = true;
    options.lowercase = true;
    options.symbols = true;
    options.exclude = '&^%_?~`\'"<>{}[]';
  } else if (complexity === 'p') {
    options.length = length <= 8 ? 12 : length;
    options.uppercase = true;
    options.lowercase = true;
    options.symbols = true;
    options.excludeSimilarCharacters = true;
  }

  const randomPassword = new RandomPassword();
  let password: string = '';

  while (password.replace(/\D/g, '') === '') {
    password = randomPassword.generate(options);
  }

  return password;
}

import crypto from 'crypto';

const RANDOM_BATCH_SIZE = 256;
let randomBytes: Buffer;
let randomIndex = 0;

// Possible combinations
const lowercase = 'abcdefghijklmnopqrstuvwxyz';
const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numbers = '0123456789';
const symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~';
const similarCharacters = /[ilLI|`oO0]/g;
const strictRules = [
  { name: 'lowercase', rule: /[a-z]/ },
  { name: 'uppercase', rule: /[A-Z]/ },
  { name: 'numbers', rule: /[0-9]/ },
  { name: 'symbols', rule: /[!@#$%^&*()+_\-=}{[\]|:;"/?.><,`~]/ },
];

class RandomPassword {
  getNextRandomValue(): number {
    if (!randomIndex || !randomBytes || randomIndex >= randomBytes.length) {
      randomIndex = 0;
      randomBytes = crypto.randomBytes(RANDOM_BATCH_SIZE);
    }

    var result = randomBytes[randomIndex];
    randomIndex += 1;

    return result;
  }

  // Generates a random number
  randomNumber(max: number): number {
    // gives a number between 0 (inclusive) and max (exclusive)
    var rand = this.getNextRandomValue();
    while (rand >= 256 - (256 % max)) {
      rand = this.getNextRandomValue();
    }
    return rand % max;
  }

  generatePool(options: any, pool: string): string {
    let password = '';

    for (let i = 0; i < options.length; i++) {
      password += pool[this.randomNumber(pool.length)];
    }

    if (options.strict) {
      // Iterate over each rule, checking to see if the password works.
      let fitsRules = strictRules.every(function (rule) {
        // If the option is not checked, ignore it.
        if (options[rule.name] == false) return true;

        // Treat symbol differently if explicit string is provided
        if (rule.name === 'symbols' && typeof options[rule.name] === 'string') {
          // Create a regular expression from the provided symbols
          const re = new RegExp('[' + options[rule.name] + ']');
          return re.test(password);
        }

        // Run the regex on the password and return whether
        // or not it matches.
        return rule.rule.test(password);
      });

      // If it doesn't fit the rules, generate a new one (recursion).
      if (!fitsRules) {
        return this.generatePool(options, pool);
      }
    }

    return password;
  }

  // Generate a random password.
  generate(options: any): string {
    // Set defaults.
    options = options || {};
    if (!Object.prototype.hasOwnProperty.call(options, 'length')) options.length = 8;
    if (!Object.prototype.hasOwnProperty.call(options, 'numbers')) options.numbers = false;
    if (!Object.prototype.hasOwnProperty.call(options, 'symbols')) options.symbols = false;
    if (!Object.prototype.hasOwnProperty.call(options, 'exclude')) options.exclude = '';
    if (!Object.prototype.hasOwnProperty.call(options, 'uppercase')) options.uppercase = true;
    if (!Object.prototype.hasOwnProperty.call(options, 'lowercase')) options.lowercase = true;
    if (!Object.prototype.hasOwnProperty.call(options, 'excludeSimilarCharacters'))
      options.excludeSimilarCharacters = false;
    if (!Object.prototype.hasOwnProperty.call(options, 'strict')) options.strict = false;

    if (options.strict) {
      let minStrictLength = 1 + (options.numbers ? 1 : 0) + (options.symbols ? 1 : 0) + (options.uppercase ? 1 : 0);
      if (minStrictLength > options.length) {
        throw new TypeError('Length must correlate with strict guidelines');
      }
    }

    // Generate character pool
    var pool = '';

    // lowercase
    if (options.lowercase) {
      pool += lowercase;
    }

    // uppercase
    if (options.uppercase) {
      pool += uppercase;
    }
    // numbers
    if (options.numbers) {
      pool += numbers;
    }

    // symbols
    if (options.symbols) {
      if (typeof options.symbols === 'string') {
        pool += options.symbols;
      } else {
        pool += symbols;
      }
    }

    // Throw error if pool is empty.
    if (!pool) {
      throw new TypeError('At least one rule for pools must be true');
    }

    // similar characters
    if (options.excludeSimilarCharacters) {
      pool = pool.replace(similarCharacters, '');
    }

    // excludes characters from the pool
    let i = options.exclude.length;
    while (i--) {
      pool = pool.replace(options.exclude[i], '');
    }

    return this.generatePool(options, pool);
  }
}
