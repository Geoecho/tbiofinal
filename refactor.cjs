const fs = require('fs');

let content = fs.readFileSync('src/pages/AdminPanel.tsx', 'utf8');

// 1. Remove useProjects and ProjectEntry from imports
content = content.replace(/useProjects,\s*/g, '');
content = content.replace(/type ProjectEntry,\s*/g, '');

// 2. Remove "projects" from activeTab type
content = content.replace(/\| "projects" /g, '');

// 3. Remove projects hook
content = content.replace(/\s*const \[projects, setProjectsHook\] = useProjects\(\);/g, '');

// 4. Remove project state variables and functions (using a rough regex to cut from handleProjectImageUpload to clearProjectForm)
content = content.replace(/\/\/ --- Initiatives\/Projects actions ---\s*(?:.|\n)*?(?=\/\/ --- Blog Posts\/Stories actions ---)/, '');

// 5. Remove the sidebar button for Initiatives
content = content.replace(/<button\s*onClick=\{\(\) => setActiveTab\("projects"\)\}(?:.|\n)*?Initiatives \(\{projects\.length\}\)\s*<\/button>/, '');

// 6. Remove the activeTab === "projects" JSX block
// The block starts with {activeTab === "projects" && ( and ends right before {/* INITIATIVES TAB */}
content = content.replace(/\{activeTab === "projects" && \((?:.|\n)*?(?=\{\/\* INITIATIVES TAB \*\/\}|\{activeTab === "stories" && \()/g, '');
content = content.replace(/\{\/\* INITIATIVES TAB \*\/\}/, '{/* STORIES & INITIATIVES TAB */}');

// 7. Rename Stories Manager to Stories & Initiatives Manager
content = content.replace(/>Stories Manager<\/h1>/g, '>Stories & Initiatives Manager</h1>');
content = content.replace(/>Publish and edit youth stories, articles, & success features.<\/p>/g, '>Publish and edit youth stories, initiatives, & success features.</p>');
content = content.replace(/<span className="font-medium text-foreground">Stories<\/span>/g, '<span className="font-medium text-foreground">Stories & Initiatives</span>');
content = content.replace(/Stories \(\{stories\.length\}\)/g, 'Stories & Initiatives ({stories.length})');

fs.writeFileSync('src/pages/AdminPanel.tsx', content);
console.log('Refactored AdminPanel.tsx successfully.');
