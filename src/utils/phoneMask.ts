const phoneMask = (str?: string) => {
  if (!str) {
    return "";
  }

  const raw = str.replace(/[\D]/g, "");

  if (raw.length > 7) {
    return raw.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  }

  if (raw.length > 2) {
    return raw.replace(/(\d{2})(\d{0,})/, "($1) $2");
  }

  if (raw.length > 0) {
    return raw.replace(/^(\d*)/, "($1");
  }

  return "";
};

export default phoneMask;
