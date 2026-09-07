## How Secure Is JWT Token

JSON Web Token (JWT) is fundamentally a compact string representation of claims, commonly containing a JSON payload. When a JWT is digitally signed, its authenticity and integrity can be verified using a cryptographic signing key.

OAuth 2.0 defines authentication semantics as per the following diagram, the `access_token` and `refresh_token` are two tokens required for OAuth 2.0 and JWT is a good fit as these tokens. Therefore JWT is commonly used to implement authentication and authorization in systems built around OAuth 2.0 and OpenID Connect.

    OAuth 2.0
    │
    │ defines the authorization flow
    │
    ├── Access Token
    │      └── can be a JWT
    │
    └── Refresh Token
            └── can be JWT or opaque token

Since a JWT uses URL-safe Base64 encoding, it can be safely transmitted in a URL, as a bearer token in an HTTP header, or in the request body. However, putting an access token in a URL is generally discouraged because URLs can be exposed through browser history, server logs, analytics systems etc. The recommended approach for API authentication is typically to send the access token as a `Bearer token` in the `Authorization HTTP header`.

A JWT can contain information, known as claims, that a server can validate without querying a database or another centralized source of authority. For example, the server can verify the token's signature and inspect claims such as the subject (sub), expiration time (exp), issuer (iss), and audience (aud). Just imagine in a heavy production traffic system the throughput that you can gain by dropping a database query or cache read per request for authentication. This self-contained nature is one reason JWTs are widely used for authentication and authorization.

Now lets look at how to generate JWT and its structure. Here is an example code in typescript that generates a JWT. Before generating JWT you need to generate a `JWT_SECRET` (a cryptographic key) as follows I am using `bun` to generate this key.

```sh
$ bun -e "console.log(Buffer.from(crypto.getRandomValues(new Uint8Array(32))).toString('base64url'))"
```

Now use the generated `JWT_SECRET` as an environment variable. The following code will generate a JWT with our `JWT_SECRET` as signin key with an expiry of five minutes.

```typescript
import { SignJWT } from "jose"

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

async function generateAccessToken(userId: string) {
    return await new SignJWT({
        sub: userId,
    })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(secret)
}

const token = await generateAccessToken("user-123456")

console.log(token)
```

The resulting token is of the following format with three parts to it.

    xxxxx.yyyyy.zzzzz
    │      │     │
    │      │     └── Signature
    │      └──────── Payload
    └────────────── Header

You may go to https://www.jwt.io/ or https://jwt.ms/ and copy paste the JWT and decode the token.  You will see the decoded token as follows.

```json
{
    "alg": "HS256"
}.{
    "sub": "user-123456",
    "iat": 1788353504,
    "exp": 1788354404
}.[Signature]
```

As you can see above anybody who can access JWT can decode it, which is why it is advised not to keep any sensitive information in the JWT. Once the token is generated it can be validated as follows.

```typescript
function verifyAccessToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, process.env.JWT_SECRET!, {
            algorithms: ["HS256"],
        })

        return payload
    } catch {
        return null
    }
}

// returns null or decoded payload
const decoded = await verifyAccessToken(token))
```

When the server can validate the JWT and make authorization decisions without maintaining server side session state for that token, the authentication mechanism can operate in a `stateless` manner. However, JWT itself is not inherently stateless; a highly secure system can still maintain server-side state for purposes such as `token revocation`, `session management`, or `refresh-token tracking`.

The JWT is typically issued by the server and stored by the client. On each request, the client sends the JWT to the server. The server verifies the token's signature and validates relevant claims, such as its expiration time. If the token is valid and the claims satisfy the server's requirements, the request is considered authenticated and the server can authorize the requested operation.

As per the OAuth 2.0 requirements we can have JWT-based authentication system involves two types of tokens and a cryptographic signing key.

1. Short lived `access_token` — a JWT used to authenticate API requests.
2. Long lived `refresh_token` — a credential used to obtain new access tokens. It can be a JWT, but it is often implemented as an opaque, random token stored and tracked by the server.
3. Signing key — a cryptographic key used by the server to sign JWTs and verify their authenticity. The signing key is kept securely by the server and is not given to the client.

An access token also know as short lived token is normally valid for a short duration. Once it expires, the client can no longer use it to access protected resources and must obtain a new access token from the server using a longer lived refresh token. If an access token is stolen, the attacker can potentially use it until the token expires. A shorter lifetime therefore limits the window during which a stolen access token can be abused. Long lived access tokens provide a larger window of opportunity for an attacker and are therefore generally less desirable from a security perspective.

In a normal scenario with a properly configured HTTPS connection, capturing an access token through a traditional man-in-the-middle attack is extremely difficult because TLS protects the communication between the client and server.

### What happens if an attacker obtains the access token ?

If attacker obtains access token through some other means for example, a compromised device, a malicious browser extension, leaked server logs, XSS, or a compromised TLS endpoint then it is a serious situation. Attacker can use it to impersonate the user and access the resources authorized by that token. In a typical stateless JWT-based authentication system, the token remains valid until it expires, unless the server has an additional mechanism for revoking or rejecting it.

Issuing a new access token to the legitimate user does not, by itself, invalidate the previously issued token. Therefore, if the user logs in on another device and receives a new access token, the attacker may still be able to use the stolen token until it expires.

But once the stolen access token expires, it can no longer be used to authenticate requests. This is one of the primary security benefits of keeping access tokens short-lived: it limits the amount of time an attacker can abuse a stolen token.

### What happens if an attacker obtains the refresh token?

This is a more serious situation. Unlike a short-lived access token, a refresh token is specifically intended to obtain new access tokens. If an attacker obtains a valid refresh token, they can present it to the legitimate refresh endpoint and potentially obtain new access tokens, allowing them to continue impersonating the user even after the original access token has expired.

The refresh endpoint response depends on how refresh tokens are implemented. A common approach is to make refresh tokens revocable and use refresh-token rotation. When a refresh token is used, the server issues a new refresh token and invalidates the previous one.

    User logs in
        │
        ▼
    Refresh Token A, Access Token A1
        │          
        │ /refresh
        ▼
    Refresh Token B invalidates A, Access Token B1
        │
        │ /refresh
        ▼
    Refresh Token C invalidates B, Access Token C1
        │
        │ /refresh
        ▼
    Refresh Token D invalidates C, Access Token D1

The refresh token rotation issues new refresh tokens after each refresh. All these refresh tokens generated in a session are called family of tokens. Server can maintain a revocation list for these refresh token typically till the expiry time of the token, if the revoked token is used after invalidating it that is most likely a stolen token and is an attempt by an attacker.
Server can now invalidate the entire family of refresh tokens generated by the user session so that user will be forced to login again or even lock the user account because of the suspicious activity.

Another mechanism is signing-key rotation. The cryptographic key used by the server to sign JWTs by the server or other trusted services to verify them. If JWT access or refresh tokens are signed with a key that is subsequently removed from the set of trusted verification keys, those tokens can no longer be verified which will force the user to authenticate again.

However, signing-key rotation is a relatively broad mechanism: depending on the implementation, it can invalidate tokens belonging to every user. Therefore, it is generally better suited to situations such as a compromised signing key, while refresh-token revocation or rotation provides more targeted control when an individual user's refresh token is compromised. MFA can also be required during re-authentication, particularly for sensitive accounts or high-risk operations.