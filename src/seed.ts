export default function seed(digits: number): string {
  let result = '';

  for (let i = 0; i < digits; i++) {
    result += Math.floor(Math.random() * 10);
  }

  return result;
}
