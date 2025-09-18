# Treasure Hunt Utilities

This folder contains helpful utilities for creating and testing treasure hunt encrypted mappings.

## Files

### generate-mappings.js
Generates the secure clues map with encrypted mappings from answers to HTML filenames.

**Usage:**
```bash
cd utils
# Edit the mappings object in the file with your answer->filename pairs
node generate-mappings.js
# Copy the generated SECURE_CLUES_MAP to your clues.js file
```

### test-mappings.js
Tests that all encrypted mappings decrypt correctly.

**Usage:**
```bash
cd utils
# Edit the mappings object and SECURE_CLUES_MAP to match your treasure hunt
node test-mappings.js
```

## How the Encryption Works

1. **Password Hashing**: Each answer is hashed using SHA-256
2. **Key Derivation**: The answer is used to derive an encryption key using PBKDF2 (100,000 iterations)
3. **Encryption**: The next filename is encrypted using AES-256-GCM with the derived key
4. **Storage**: The hash maps to the encrypted filename in `SECURE_CLUES_MAP`

## Creating a New Treasure Hunt

1. Edit `generate-mappings.js` with your answer->filename mappings
2. Run `node generate-mappings.js` 
3. Copy the generated `SECURE_CLUES_MAP` to your treasure hunt's `clues.js`
4. Test with `test-mappings.js` to ensure everything works

## Security Notes

- The salt "treasure-hunt-2025" is hardcoded - consider changing it for different hunts
- This provides obfuscation, not true security (since it's client-side)
- Perfect for educational games and puzzles