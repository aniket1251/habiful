const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateEmail(email: string): {
  valid: boolean;
  message?: string;
} {
  if (!email || email.trim() === "") {
    return { valid: false, message: "Email is required" };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }
  return { valid: true };
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one digit");
  }

  return { valid: errors.length === 0, errors };
}

export function validateRole(role: string): {
  valid: boolean;
  message?: string;
} {
  const validRoles = ["tenant", "manager"];
  if (!role || !validRoles.includes(role.toLowerCase())) {
    return {
      valid: false,
      message: "Role must be 'tenant' or 'manager'",
    };
  }
  return { valid: true };
}
