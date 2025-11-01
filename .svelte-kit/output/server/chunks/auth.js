import * as jose from "jose";
import crypto from "node:crypto";
import AWS from "aws-sdk";
async function isAuthenticated(cookies) {
  const jwt = cookies.get("jwt");
  if (jwt) {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    try {
      if (!await jose.jwtVerify(jwt, secret)) {
        return { status: "ANONYMOUS" };
      }
      const payload = jose.decodeJwt(jwt);
      if (payload.verified) {
        return { status: "VERIFIED", username: payload.username };
      } else {
        return { status: "UNVERIFIED", username: payload.username };
      }
    } catch (e) {
      console.log(e);
    }
  }
  return { status: "ANONYMOUS" };
}
async function getEncryptionSecret() {
  const client = new AWS.SSM({ region: "us-east-1" });
  const response = await client.getParameter({ Name: "ENC_SECRET", WithDecryption: false }).promise();
  return response.Parameter?.Value || "";
}
async function verifyToken(encodedToken) {
  try {
    let secret = "";
    if (process.env.ENVIRONMENT == "prod") {
      secret = await getEncryptionSecret();
    } else if (process.env.ENVIRONMENT == "dev") {
      secret = process.env.SECRET_KEY || "";
    }
    if (encodedToken.length == 0) {
      return [{}, false];
    }
    const key = Buffer.from(secret);
    const decodedToken = Buffer.from(encodedToken, "base64");
    const byteLength = decodedToken.subarray(0, 4).readInt32BE();
    const iv = decodedToken.subarray(4).subarray(0, 12);
    const payloadWithTag = decodedToken.subarray(4).subarray(0, byteLength).subarray(12);
    const authTag = payloadWithTag.subarray(payloadWithTag.length - 16);
    const payload = payloadWithTag.subarray(0, payloadWithTag.length - 16);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(payload);
    decipher.final();
    return [JSON.parse(decrypted.toString()), true];
  } catch (e) {
    return [{}, false];
  }
}
export {
  isAuthenticated as i,
  verifyToken as v
};
