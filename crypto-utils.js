// Crypto utility functions for password hashing and decryption

async function sha256(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function deriveKey(password) {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        enc.encode(password),
        { name: 'PBKDF2' },
        false,
        ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: enc.encode('treasure-hunt-2025'),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );
}

async function decrypt(password, ciphertext) {
    try {
        const key = await deriveKey(password);
        const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
        
        const iv = combined.slice(0, 12);
        const encrypted = combined.slice(12, -16);
        const authTag = combined.slice(-16);
        
        // Combine encrypted data and auth tag for Web Crypto API
        const cipherData = new Uint8Array(encrypted.length + authTag.length);
        cipherData.set(encrypted);
        cipherData.set(authTag, encrypted.length);
        
        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            cipherData
        );
        
        return new TextDecoder().decode(decrypted);
    } catch (e) {
        console.error('Decryption failed:', e);
        return null;
    }
}

// Export for use in other scripts
window.cryptoUtils = {
    sha256,
    decrypt
};