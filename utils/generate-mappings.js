const crypto = require('crypto');

// Mappings from answers to next pages
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

// SHA256 hash function
function sha256(message) {
    return crypto.createHash('sha256').update(message).digest('hex');
}

// Derive key using PBKDF2
function deriveKey(password) {
    const salt = Buffer.from('treasure-hunt-2025', 'utf8');
    return crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
}

// Encrypt function matching the browser crypto API behavior
function encrypt(plaintext, password) {
    const key = deriveKey(password);
    const iv = crypto.randomBytes(12);
    
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    
    const encrypted = Buffer.concat([
        cipher.update(plaintext, 'utf8'),
        cipher.final()
    ]);
    
    const authTag = cipher.getAuthTag();
    
    // Combine IV + encrypted + authTag
    const combined = Buffer.concat([iv, encrypted, authTag]);
    
    return combined.toString('base64');
}

// Generate the secure clues map
function generateCluesMap() {
    const SECURE_CLUES_MAP = {};
    
    console.log('Generating secure clues map...\n');
    
    for (const [answer, nextPage] of Object.entries(mappings)) {
        const hash = sha256(answer);
        const encrypted = encrypt(nextPage, answer);
        SECURE_CLUES_MAP[hash] = encrypted;
        console.log(`Mapped: ${answer} -> ${nextPage}`);
        console.log(`  Hash: ${hash}`);
        console.log(`  Encrypted: ${encrypted}\n`);
    }
    
    // Generate the clues.js content
    const cluesContent = `// Secure clues map for Jewel Hunt: H(answer) -> Enc(answer, filename)
// Generated using crypto-utils.js functions
export const SECURE_CLUES_MAP = ${JSON.stringify(SECURE_CLUES_MAP, null, 2)};`;
    
    console.log('\n\nGenerated clues.js content:');
    console.log('=' . repeat(80));
    console.log(cluesContent);
    console.log('=' . repeat(80));
    
    return cluesContent;
}

// Run the generation
const cluesContent = generateCluesMap();