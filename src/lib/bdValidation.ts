/**
 * Bangladesh commerce validation & formatting utilities
 */

export const BD_DIVISIONS = [
  'Dhaka',
  'Chittagong',
  'Sylhet',
  'Rajshahi',
  'Khulna',
  'Barisal',
  'Rangpur',
  'Mymensingh'
] as const;

export type BDDivision = typeof BD_DIVISIONS[number];

/**
 * Validates a Bangladeshi mobile phone number.
 * Valid prefixes: 013, 014, 015, 016, 017, 018, 019
 * Total length: exactly 11 digits (or +8801... / 8801...)
 */
export function validateBDPhoneNumber(phone: string): { isValid: boolean; formatted: string; message?: string } {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check international format (+8801... or 8801...)
  const intlMatch = cleaned.match(/^(?:\+88|88)?(01[3-9]\d{8})$/);
  if (intlMatch) {
    return {
      isValid: true,
      formatted: intlMatch[1]
    };
  }

  // Check 11-digit local format
  if (/^01[3-9]\d{8}$/.test(cleaned)) {
    return {
      isValid: true,
      formatted: cleaned
    };
  }

  if (cleaned.length === 0) {
    return { isValid: false, formatted: cleaned, message: 'Phone number is required' };
  }

  if (!/^01/.test(cleaned)) {
    return { isValid: false, formatted: cleaned, message: 'Must start with a valid Bangladeshi operator (013 - 019)' };
  }

  if (cleaned.length !== 11) {
    return { isValid: false, formatted: cleaned, message: `Phone number must be exactly 11 digits (currently ${cleaned.length})` };
  }

  return {
    isValid: false,
    formatted: cleaned,
    message: 'Invalid Bangladeshi phone number. Example: 01712345678'
  };
}

/**
 * Formats a number to Bangladeshi Taka currency format (e.g. ৳ 1,250)
 */
export function formatBDT(amount: number): string {
  const rounded = Math.round(amount);
  return `৳${rounded.toLocaleString('en-IN')}`;
}
