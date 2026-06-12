// Valid regex expressions used across forms
export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^[6-9]\d{9}$/;

/**
 * Reusable input validation rules engine
 */
export const validateField = (name, value, additionalData = {}) => {
  // 1. Character Limit Restrictions (Generic text limits)
  if (additionalData.maxLength && value.length > additionalData.maxLength) {
    return `${additionalData.label || name} cannot exceed ${additionalData.maxLength} characters.`;
  }
  if (additionalData.minLength && value.length < additionalData.minLength) {
    return `${additionalData.label || name} must be at least ${additionalData.minLength} characters.`;
  }

  // 2. Individual Field Rule Validations
  switch (name) {
    case "name":
      if (!value.trim()) return "Name is required.";
      break;

    case "username":
      if (!value) return "Username is required.";
      if (!USERNAME_REGEX.test(value)) {
        return "Username can contain only letters, numbers, and underscore (_).";
      }
      break;

    case "email":
      if (!value) return "Email address is required.";
      if (!EMAIL_REGEX.test(value)) return "Enter a valid email address.";
      break;

    case "phone":
      if (!value) return "Phone number is required.";
      if (!PHONE_REGEX.test(value)) return "Enter a valid 10-digit phone number.";
      break;

    case "password":
      if (!value) return "Password is required.";
      if (value.length < 6) return "Password must be at least 6 characters long.";
      // Optional security rule:
      if (!/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        return "Password needs at least one uppercase letter and one number.";
      }
      break;

    case "confirmPassword":
      if (!value) return "Please confirm your password.";
      if (value !== additionalData.passwordMatch) return "Passwords do not match.";
      break;

    case "shopName":
      if (!value.trim()) return "Shop name is required.";
      break;

    case "city":
      if (!value) return "City selection is required.";
      break;

    // Custom form types (Contact / Review / Claim)
    case "subject":
      if (!value.trim()) return "Subject line is required.";
      break;

    case "message":
    case "reviewText":
    case "claimReason":
      if (!value.trim()) return "Message body content is required.";
      break;

    case "rating":
      if (!value || value < 1 || value > 5) return "Please select a rating between 1 and 5.";
      break;

    default:
      break;
  }

  return null; // Passes verification safely
};