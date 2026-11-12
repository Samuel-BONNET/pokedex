import jwt from 'jsonwebtoken'

export function signToken(payload: object) {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('La variable d\'environnement JWT_SECRET est introuvable.')
    }
    return jwt.sign(payload, secret, {
        expiresIn: '1h',
    })
}

export function verifyToken(token: string) {
    const secret = process.env.JWT_SECRET
    if (!secret) {
        throw new Error('La variable d\'environnement JWT_SECRET est introuvable.')
    }
    return jwt.verify(token, secret)
}
