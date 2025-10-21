#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Recursively find files matching pattern
 */
function findFiles(dir, extensions) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          traverse(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item);
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  traverse(dir);
  return files;
}

/**
 * Fix incorrect import syntax in UI components
 */
function fixImports() {
  console.log('🔧 Fixing import syntax issues...');
  
  // Find all TypeScript/JavaScript files in src/components/ui
  const files = findFiles('src/components/ui', ['.ts', '.tsx', '.js', '.jsx']);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let originalContent = content;
      
      // Fix import statements with version specifiers
      content = content.replace(/from\s+["']([^"']+)@[0-9.]+["']/g, 'from "$1"');
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content);
        console.log(`✅ Fixed imports in: ${file}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Error fixing ${file}:`, error.message);
    }
  });
  
  console.log(`\n🎉 Fixed imports in ${fixedCount} files`);
}

// Run if called directly
if (require.main === module) {
  fixImports();
}

module.exports = fixImports;
