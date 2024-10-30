export const lamportsToSol = (lamports: number): string => {
  const sol = lamports / 1_000_000_000; // 1 SOL = 1 billion lamports
  const formattedSol = sol.toFixed(9).replace(/\.?0+$/, ''); // Remove trailing zeros and decimal point if necessary
  return `${formattedSol}`;
};
