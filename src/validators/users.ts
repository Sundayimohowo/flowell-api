import { z } from 'zod';

export const userValidatorSchema = z.object({
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
  email: z.string().nonempty('Email is required'),
});

export const userLoginValidatorSchema = z.object({
  email: z.string().nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
});

export const userPasswordResetValidatorSchema = z.object({
  email: z.string().nonempty('Email is required'),
});

export const userChangePasswordValidatorSchema = z.object({
  email: z.string().nonempty('Email is required'),
  verificationCode: z.string().nonempty('Verification code is required'),
  newPassword: z.string().nonempty('New password is required'),
});
