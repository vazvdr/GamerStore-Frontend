export function normalizeText() {
    return text
      .toLowerCase()
      .normalize("NFD") // separa acentos
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-z0-9]/g, "") // remove espaços, hífen, underline etc
      .trim();
  }
  