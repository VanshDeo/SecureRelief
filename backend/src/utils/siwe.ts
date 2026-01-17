import { generateNonce, SiweMessage } from 'siwe';

export const createNonce = (): string => {
    return generateNonce();
};

export const verifySiweMessage = async (
    message: string,
    signature: string,
    nonce: string
): Promise<{ success: boolean; data?: SiweMessage; error?: any }> => {
    try {
        const siweMessage = new SiweMessage(message);
        const result = await siweMessage.verify({ signature, nonce });
        return { success: true, data: result.data };
    } catch (error) {
        console.error('SIWE Verification Error:', error);
        return { success: false, error };
    }
};
