import { PrismaClient, User, Role, Status } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export class AuthService {
    // --- User Management ---

    static async findUserByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { email } });
    }

    static async findUserByWallet(walletAddress: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { walletAddress } });
    }

    static async findUserById(id: string): Promise<User | null> {
        return prisma.user.findUnique({ where: { id } });
    }

    static async createUser(data: {
        name: string;
        email: string;
        passwordHash: string;
        walletAddress: string;
        role: Role;
        status: Status;
    }): Promise<User> {
        return prisma.user.create({ data });
    }

    static async updateUserNonce(id: string, nonce: string | null): Promise<User> {
        return prisma.user.update({
            where: { id },
            data: { nonce },
        });
    }

    // --- Security ---

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

    // --- Tokens ---

    static generateTokens(user: { id: string; role: Role; walletAddress: string }) {
        const accessToken = jwt.sign(
            { userId: user.id, role: user.role, walletAddress: user.walletAddress },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: (process.env.JWT_ACCESS_EXPIRY || '15m') as jwt.SignOptions['expiresIn'] }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: (process.env.JWT_REFRESH_EXPIRY || '7d') as jwt.SignOptions['expiresIn'] }
        );

        return { accessToken, refreshToken };
    }
}
