# Frontend - Conversion helper

I added a script `convert_to_jsx.js` at the project root that attempts to:

- Rename `.tsx` -> `.jsx` and `.ts` -> `.js` inside `src/`
- Update relative import statements to reference the new extensions when possible

**Usage:**
```bash
cd sellosg-frontend
node convert_to_jsx.js
```

After running, review changes and fix any TypeScript-specific syntax (types) manually; automated renaming cannot convert TS types.

