const crypto = require('crypto');

// Test mappings
const mappings = {
    "711": "clue2_prism.html",
    "proto-flamingo": "clue3_shimmer.html",
    "mona-lisa": "clue4_sparkle.html",
    "millennium-falcon": "clue5_glitter.html",
    "teotihuacan": "clue6_radiance.html",
    "2002-games": "clue7_lustre.html",
    "pour-teva": "clue8_gleam.html",
    "sole-partner": "clue9_brilliance.html",
    "acornimals": "clue10_dazzle.html",
    "patience": "clue11_glimmer.html",
    "queen-marigold": "clue12_shine.html",
    "thomas": "clue13_splendor.html",
    "16": "final_treasure.html"
};

// Generated map from clues.js
const SECURE_CLUES_MAP = {
  "b17ef6d19c7a5b1ee83b907c595526dcb1eb06db8227d650d5dda0a9f4ce8cd9": "LFllbKnSqlSRJQx19yivjQC8EJQBSb6ePuqlrgFDjO09u69h4v1phpQfSdGMeRI=",
  "2499d690642faa4da2a67b078236d1c031217f3c31cf2da2142c8e84e3d617f1": "PMJBuzdKzUlQW0R7QmIjcp78RiJlw62wZZ/eqxh+XMEP+IYiTA57smLnrX4=",
  "5aa6b2d074c61c3dbfc9054138c4c60e0938dec3e859ab0111b2e73f757c2ba0": "B2ks824t9SL00pdpvg5P1IbegiD5XGnbuFFz9xghBuasSl6qW8AlcAf9hWNYzw==",
  "e15ea50b057a040ffeee6df3eeed7dcf744309a0b0c42b491734adff15944583": "Vaa2HAWMPhqdyyBDidAPqEpwWDiFuWh8TleoNx0lw7qqerFNXqyfBa2YQJruSQ==",
  "ea83a6989d84840b4368cccbaa8d595d378c1088533635faab35636fbbf8e296": "hPEV7benYbS3BBw4vNWCZjdziJr6E0ERINFAJDdr07ZAl3Z+HLG2zHOn7jujSw==",
  "e39281dce27d0b28f0190859245d38906d0fce584ea3cb14d2111c2c96859034": "gH0qFL+sk1QhrCUCaOcLxf1ER6wrrOrbg0FyyBM9/irSjI67NERe/F0GIOFicjU=",
  "2914853ffbe9e61fc2cac3c509c2b822817b26a01a4830b9473b83424550569e": "WgPoQDVkgpyoiEUIO8wSyZuWaR+2UGlNcRKEORnW4B5Q2UQKGArRJtC2rOxQ",
  "c65f4549576848624ea6573f371916432aef3116bd4ae3d191fab0be8057e093": "CU9nZXjeOap/+E1XXxmKidUQgNiAFQ3WvghMmXbe75OxoGO77qgsW1X6H3w=",
  "4439185ab4af8eab1fa8ea272d1f2f26f752d7424bb981d363ef9f6275d10730": "xSEvTWbsAWCfteicpIOpYF235KesfkQ6dzjWGgDvavf48NU9BqI1MQ25/tQ7f0O9AA==",
  "921b1cee67c29c2d3221ff07a284f8db185720c3440b029386d045783490cdb2": "yISd/QWjYwA7Lb0QBARx0Tbh9s41TEQuME/MovOUFxR2wbwqChH+fCbTyl4DNQ==",
  "96d61fe343ddf5e0d8d68b1d0b08b9af50973a0ebdd38021fae327bbea1b4c13": "TW+jq4HxmQ4A59xeX/Zu2u5YV5NFle2C0ni1/cL94axsxUtKw353VUrYswmphQ4=",
  "911cb32f8735cbbb5356ccf7d2d5d96013562d4c1b30aeb4c7ae0a261fa1714d": "M6w0mYeNIi+a5ByVMB3iJitiKvZyvFfUEuNb0MdfpKfdjpgxfYnWVpQkfuno",
  "d38681074467c0bc147b17a9a12b9efa8cc10bcf545f5b0bccccf5a93c4a2b79": "LNx2ndEcJT1kbRvnCjoFZYDujY3ijkLzO9giIdB18wuDKVIuFchyou5Zyw0MddEj"
};

// SHA256 hash function
function sha256(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

// Derive key using PBKDF2
function deriveKey(password) {
    const salt = Buffer.from('treasure-hunt-2025', 'utf8');
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

// Decrypt function matching the browser crypto API behavior
function decrypt(ciphertext, password) {
    try {
        const key = deriveKey(password);
        const combined = Buffer.from(ciphertext, 'base64');
        
        const iv = combined.slice(0, 12);
        const authTag = combined.slice(-16);
        const encrypted = combined.slice(12, -16);
        
        const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
        decipher.setAuthTag(authTag);
        
        const decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ]);
        
        return decrypted.toString('utf8');
    } catch (e) {
        console.error('Decryption failed:', e.message);
        return null;
    }
}

// Test all mappings
console.log('Testing all answer mappings:\n');

for (const [answer, expectedPage] of Object.entries(mappings)) {
    const hash = sha256(answer);
    const encrypted = SECURE_CLUES_MAP[hash];
    
    if (!encrypted) {
        console.log(`✗ ${answer} -> NOT FOUND IN MAP`);
        continue;
    }
    
    const decrypted = decrypt(encrypted, answer);
    const status = decrypted === expectedPage ? '✓' : '✗';
    console.log(`${status} ${answer} -> ${decrypted} (expected: ${expectedPage})`);
}

console.log('\nAll tests completed!');