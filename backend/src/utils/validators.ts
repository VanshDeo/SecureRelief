import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
    walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
    role: z.enum(["DONOR", "BENEFICIARY", "VENDOR", "ADMIN", "ORACLE"]),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const loginSchema = z.object({
    email: z.string().email(),
    signedMessage: z.string(),
    nonce: z.string(),
});
