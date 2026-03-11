import { email, z } from 'zod';

// Simple validation schemas for user signup and login using Zod
const signupSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters long.'),
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters long.'),
})

export {
    signupSchema,
    loginSchema
}