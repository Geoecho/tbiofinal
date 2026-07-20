const fs = require('fs');
const path = require('path');

const filesToProcess = [
  'src/pages/AdminPanel.tsx',
  'src/components/Stories.tsx'
];

filesToProcess.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Fix empty alt
  content = content.replace(/alt=""(?! aria-hidden)/g, 'alt="" aria-hidden="true"');

  // Fix buttons/links with title but no aria-label
  content = content.replace(/(<button|<a)([^>]+)title="([^"]+)"([^>]*)>/g, (match, tag, before, title, after) => {
    if (before.includes('aria-label') || after.includes('aria-label')) {
      return match;
    }
    return `${tag}${before}title="${title}" aria-label="${title}"${after}>`;
  });

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log(`Processed ${file}`);
});
