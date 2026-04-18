export const fmt = (val, dec = 2) => {
  if (val === undefined || val === null || isNaN(val)) return "$0.00";
  const sign = val < 0 ? "-" : "";
  const abs = Math.abs(val);
  const str = abs.toLocaleString("en-US", {
    minimumFractionDigits: dec,
    maximumFractionDigits: dec,
  });
  return sign + "$" + str;
};

export const fmtNum = (val) => {
  if (!val && val !== 0) return "0";
  if (Math.abs(val) < 1e-9) return "~0";
  if (Math.abs(val) < 0.0001) return val.toExponential(3);
  return val.toLocaleString("en-US", { maximumFractionDigits: 6 });
};
