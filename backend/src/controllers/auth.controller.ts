import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { createNonce, verifySiweMessage } from '../utils/siwe';
import { loginSchema, registerSchema } from '../utils/validators';
import { Role, Status } from '@prisma/client';

export class AuthController {

    // POST /auth/precheck
    static async precheck(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.body;
            if (!email) {
                res.status(400).json({ error: 'Email is required' });
                return;
            }

            const user = await AuthService.findUserByEmail(email);
            if (!user) {
                res.status(404).json({ error: 'User not found. Please register first.' });
                return;
            }

            const nonce = createNonce();
            await AuthService.updateUserNonce(user.id, nonce);

            res.json({
                walletAddress: user.walletAddress,
                nonce,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /auth/nonce
    static async getNonce(req: Request, res: Response): Promise<void> {
        // Similar to precheck but could accept wallet address
        try {
            const { walletAddress } = req.body;
            if (!walletAddress) {
                res.status(400).json({ error: 'Wallet address is required' });
                return;
            }

            const user = await AuthService.findUserByWallet(walletAddress);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            const nonce = createNonce();
            await AuthService.updateUserNonce(user.id, nonce);
            res.json({ nonce });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


    // POST /auth/register
    static async register(req: Request, res: Response): Promise<void> {
        try {
            const validation = registerSchema.safeParse(req.body);
            if (!validation.success) {
                res.status(400).json({ error: validation.error.issues });
                return;
            }

            const { name, email, password, walletAddress, role } = validation.data;

            const existingEmail = await AuthService.findUserByEmail(email);
            if (existingEmail) {
                res.status(409).json({ error: 'Email already exists' });
                return;
            }

            const existingWallet = await AuthService.findUserByWallet(walletAddress);
            if (existingWallet) {
                res.status(409).json({ error: 'Wallet address already exists' });
                return;
            }

            const passwordHash = await AuthService.hashPassword(password);

            let status: Status = Status.PENDING;
            if (role === Role.DONOR) status = Status.ACTIVE;
            if (role === Role.ADMIN) status = Status.BLOCKED;

            await AuthService.createUser({
                name,
                email,
                passwordHash,
                walletAddress,
                role: role as Role,
                status,
            });

            res.status(201).json({ message: 'Registration successful. Please login.' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /auth/login
    static async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, message, signature } = req.body; // Expecting 'message' (the SIWE message text) and 'signature'

            if (!email || !message || !signature) {
                res.status(400).json({ error: 'Email, message, and signature are required' });
                return;
            }

            const user = await AuthService.findUserByEmail(email);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            if (!user.nonce) {
                res.status(400).json({ error: 'Nonce not generated for user' });
                return;
            }

            // Verify SIWE signature 
            // The message provided by frontend must contain the nonce we gave them.
            const verification = await verifySiweMessage(message, signature, user.nonce);

            if (!verification.success) {
                res.status(401).json({ error: 'Invalid signature', details: verification.error });
                return;
            }

            // Check if the address in the message matches the user's registered wallet
            if (verification.data?.address.toLowerCase() !== user.walletAddress.toLowerCase()) {
                res.status(401).json({ error: 'Wallet address mismatch' });
                return;
            }

            // Invalidate nonce
            await AuthService.updateUserNonce(user.id, null);

            if (user.status === Status.BLOCKED || user.status === Status.SUSPENDED) {
                res.status(403).json({ error: 'Account is locked' });
                return;
            }

            const tokens = AuthService.generateTokens(user);

            res.json({
                ...tokens,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    status: user.status
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /auth/me
    static async me(req: any, res: Response): Promise<void> {
        try {
            if (!req.user || !req.user.userId) {
                res.status(401).json({ error: 'Unauthorized' });
                return;
            }

            const user = await AuthService.findUserById(req.user.userId);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
                return;
            }

            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                walletAddress: user.walletAddress,
                role: user.role,
                status: user.status
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /auth/logout (stateless JWT, but placeholder)
    static async logout(req: Request, res: Response): Promise<void> {
        res.json({ message: 'Logged out successfully' });
    }
}
