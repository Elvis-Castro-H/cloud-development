const forbiddenWords = [
    "mierda", "puta", "hijo de puta", "maldito", "desgraciado", "idiota", "imbécil", "estúpido", "tonto", "gilipollas", "cabrón", "coño", "pendejo", "pendeja", "puto", "puta madre", "chingar", "chingada", "verga", "caca"
];

export function moderateContent(input: string): string {
  const pattern = new RegExp(`\\b(${forbiddenWords.join("|")})\\b`, "gi");
  return input.replace(pattern, "[redacted]");
}
