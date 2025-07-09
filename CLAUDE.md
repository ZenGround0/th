# Treasure Hunt Website Project Context

## Project Overview
This is a treasure hunt website built as a static site hosted on GitHub Pages. Users progress through the hunt by discovering and entering passwords to unlock subsequent clues.

## Technical Stack
- **Hosting**: GitHub Pages (static site)
- **Frontend**: HTML, CSS, JavaScript
- **Build System**: Consider Jekyll for better organization
- **No backend**: All logic must be client-side

## Core Features

### Password-Based Progression System
- Users enter passwords to unlock next stages
- Each correct password redirects to a new clue page
- Validation happens client-side via JavaScript

### User Flow
1. Land on initial clue page
2. Solve puzzle/riddle to discover password
3. Enter password in input field
4. JavaScript validates the password
5. On success: redirect to next clue page
6. On failure: show error message

## Implementation Architecture

### Page Structure
```
/index.html          - First clue page
/clue2.html         - Second clue (accessed via password from first)
/clue3.html         - Third clue
/final.html         - Completion page
```

### Password Validation Approach
- Store hashed passwords in JavaScript
- Compare user input against hashed values
- Use obfuscation to prevent easy source code inspection

### Design Considerations
- Minimal, clean interface focusing on the clue content
- Clear password input field
- Subtle error messages for wrong passwords
- Mobile-responsive design

## Security Notes
- This is a fun game, not a secure system
- Passwords will be visible in source code (obfuscated)
- Focus on user experience over true security

## Development Guidelines
- Keep it simple and static
- Test on GitHub Pages environment
- Ensure all paths work with GitHub Pages URL structure
- Consider using relative paths for assets

## Future Enhancements
- Timer functionality
- Hint system
- Progress tracking (localStorage)
- Multiple difficulty paths
- Team/multiplayer support

## Key Constraints
- Must work entirely client-side
- No database or server-side logic
- GitHub Pages hosting limitations
- All assets must be committed to repository