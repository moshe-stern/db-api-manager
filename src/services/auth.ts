import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}/discovery/v2.0/keys`,
});


function getKey(header: jwt.JwtHeader, callback: (err: Error | null, key?: string) => void): void {
    client.getSigningKey(header.kid as string, (err, key) => {
        if (err) {
            return callback(err);
        }
        const signingKey = key?.getPublicKey();
        callback(null, signingKey);
    });
}

export async function verifyToken(
    token: string,
    callback: (err: Error | null, decodedToken?: JwtPayload) => void
): Promise<void> {
    jwt.verify(
        token,
        getKey,
        { algorithms: ["RS256"] },
        (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
            if (err) {
                return callback(err, undefined);
            }

            if (typeof decoded === "string" || decoded === undefined) {
                return callback(new Error("Invalid token structure"), undefined);
            }

            const accessToken = decoded as JwtPayload;

            function confirmTenant(): boolean {
                return accessToken.tid === process.env.AZURE_TENANT_ID;
            }

            function confirmExpiration(): boolean {
                return accessToken.exp ? accessToken.exp * 1000 > Date.now() : false;
            }

            const tokenIsValid =
                confirmTenant() &&
                confirmExpiration();

            if (!tokenIsValid) {
                return callback(new Error("Invalid token claims"), undefined);
            }

            callback(null, accessToken);
        }
    );
}
