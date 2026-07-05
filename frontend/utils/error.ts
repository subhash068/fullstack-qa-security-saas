export const extractErrorMessage = (err: any, fallback: string): string => {
  const detail = err.response?.data?.detail;
  if (!detail) return fallback;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail.map((d: any) => {
      if (typeof d === 'string') return d;
      // Format Pydantic field location + message
      const field = d.loc ? d.loc.filter((l: any) => l !== 'body').join('.') : '';
      return field ? `${field}: ${d.msg}` : d.msg;
    }).join(', ');
  }
  if (typeof detail === 'object') {
    return detail.message || JSON.stringify(detail);
  }
  return fallback;
};
