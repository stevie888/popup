// Real-world validation utilities

// Email validation functions
export const emailValidation = {
  // Check if email domain exists
  async checkDomain(email: string): Promise<{ valid: boolean; message?: string }> {
    const domain = email.split('@')[1];
    if (!domain) {
      return { valid: false, message: 'Invalid email format' };
    }

    try {
      // Simple DNS check for domain
      const response = await fetch(`https://dns.google/resolve?name=${domain}&type=MX`);
      const data = await response.json();
      
      if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
        return { valid: true };
      } else {
        return { valid: false, message: 'Email domain does not exist' };
      }
    } catch (error) {
      console.error('Domain validation error:', error);
      return { valid: true }; // Fallback to valid if check fails
    }
  },

  // Check for disposable email domains
  isDisposableEmail(email: string): boolean {
    const disposableDomains = [
      '10minutemail.com', 'guerrillamail.com', 'tempmail.org', 'mailinator.com',
      'yopmail.com', 'throwaway.email', 'temp-mail.org', 'sharklasers.com',
      'getairmail.com', 'mailnesia.com', 'mintemail.com', 'spam4.me',
      'bccto.me', 'chacuo.net', 'dispostable.com', 'fakeinbox.com'
    ];
    
    const domain = email.split('@')[1]?.toLowerCase();
    return disposableDomains.includes(domain || '');
  },

  // Comprehensive email validation
  async validateEmail(email: string): Promise<{ valid: boolean; message?: string }> {
    // Basic format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Invalid email format' };
    }

    // Check for disposable email
    if (this.isDisposableEmail(email)) {
      return { valid: false, message: 'Disposable email addresses are not allowed' };
    }

    // Check domain existence
    const domainCheck = await this.checkDomain(email);
    if (!domainCheck.valid) {
      return domainCheck;
    }

    return { valid: true };
  }
};

// Phone number validation functions
export const phoneValidation = {
  // Validate Nepali mobile number format and carrier
  validateNepaliMobile(mobile: string): { valid: boolean; message?: string; carrier?: string } {
    const cleanMobile = mobile.replace(/\D/g, '');
    
    if (cleanMobile.length !== 10) {
      return { valid: false, message: 'Mobile number must be 10 digits' };
    }

    if (!/^9[0-9]{9}$/.test(cleanMobile)) {
      return { valid: false, message: 'Mobile number must start with 9' };
    }

    // Nepali carrier prefixes
    const carriers: { [key: string]: string } = {
      '984': 'Nepal Telecom (NTC)',
      '985': 'Nepal Telecom (NTC)',
      '986': 'Nepal Telecom (NTC)',
      '980': 'Ncell',
      '981': 'Ncell',
      '982': 'Ncell',
      '983': 'Ncell',
      '988': 'Ncell',
      '989': 'Ncell',
      '970': 'Smart Telecom',
      '971': 'Smart Telecom',
      '972': 'Smart Telecom',
      '973': 'Smart Telecom'
    };

    const prefix = cleanMobile.substring(0, 3);
    const carrier = carriers[prefix];

    if (!carrier) {
      return { valid: false, message: 'Invalid mobile number prefix' };
    }

    return { valid: true, carrier };
  },

  // Check if number is likely active (basic heuristics)
  isLikelyActive(mobile: string): boolean {
    const cleanMobile = mobile.replace(/\D/g, '');
    
    // Basic checks for likely active numbers
    // In real implementation, you'd use a service like Twilio Lookup API
    
    // Check if it's not a test number pattern
    const testPatterns = [
      '9999999999', '0000000000', '1111111111', '1234567890',
      '9876543210', '5555555555', '6666666666', '7777777777'
    ];
    
    if (testPatterns.includes(cleanMobile)) {
      return false;
    }

    // Check if it's not a sequential number
    const digits = cleanMobile.split('').map(Number);
    const isSequential = digits.every((digit, index) => 
      index === 0 || digit === digits[index - 1] + 1
    );
    
    if (isSequential) {
      return false;
    }

    return true;
  }
};

// SMS verification (mock implementation)
export const smsVerification = {
  // In real implementation, this would use Twilio, AWS SNS, or similar service
  async sendVerificationCode(mobile: string): Promise<{ success: boolean; message?: string }> {
    // Mock implementation - in real app, this would send actual SMS
    console.log(`Mock SMS sent to ${mobile}: Your verification code is 123456`);
    
    return { 
      success: true, 
      message: 'Verification code sent (mock implementation)' 
    };
  },

  async verifyCode(mobile: string, code: string): Promise<{ valid: boolean; message?: string }> {
    // Mock verification - in real app, this would check against stored code
    if (code === '123456') {
      return { valid: true };
    } else {
      return { valid: false, message: 'Invalid verification code' };
    }
  }
};

// Email verification (mock implementation)
export const emailVerification = {
  // In real implementation, this would send actual verification email
  async sendVerificationEmail(email: string): Promise<{ success: boolean; message?: string }> {
    // Mock implementation - in real app, this would send actual email
    console.log(`Mock email sent to ${email}: Click here to verify your account`);
    
    return { 
      success: true, 
      message: 'Verification email sent (mock implementation)' 
    };
  },

  async verifyEmailToken(token: string): Promise<{ valid: boolean; message?: string }> {
    // Mock verification - in real app, this would check against stored token
    if (token === 'mock-verification-token') {
      return { valid: true };
    } else {
      return { valid: false, message: 'Invalid verification token' };
    }
  }
}; 