import { Project, SyntaxKind } from 'ts-morph';
import { join, dirname, basename } from 'path';
import { mkdir, readdir, rmdir, stat } from 'fs/promises';

/**
 * Splits a TypeScript file into multiple files, one per exported declaration
 * Usage: deno run -A generator.ts split path/to/file.ts
 */
async function splitFile(filePath: string): Promise<void> {
  const project = new Project();
  const sourceFile = project.addSourceFileAtPath(filePath);

  if (!sourceFile) {
    throw new Error(`Could not load file: ${filePath}`);
  }

  // Get the directory where split files will be created
  const fileDir = dirname(filePath);
  const fileName = basename(filePath, '.ts');
  const outputDir = join(fileDir, fileName);

  await mkdir(outputDir, { recursive: true });

  console.log(`Splitting ${filePath} into ${outputDir}/`);

  // Extract types first
  const types: string[] = [];
  sourceFile.getTypeAliases().forEach((typeAlias) => {
    if (typeAlias.isExported()) {
      types.push(typeAlias.getText());
    }
  });
  sourceFile.getInterfaces().forEach((iface) => {
    if (iface.isExported()) {
      types.push(iface.getText());
    }
  });

  // Create types.ts if there are exported types
  if (types.length > 0) {
    const typesFile = project.createSourceFile(join(outputDir, 'types.ts'), '', {
      overwrite: true,
    });
    typesFile.addStatements(types);
    console.log(`  ✓ types.ts (${types.length} types)`);
  }

  // Get all import declarations from original file
  const imports = sourceFile.getImportDeclarations();

  // Build a map of imported identifiers to their import statements
  const importMap = new Map<string, string>();
  imports.forEach((imp) => {
    const namedImports = imp.getNamedImports();
    namedImports.forEach((namedImport) => {
      const importedName = namedImport.getName();
      const text = imp.getText();
      // Adjust relative import paths to go up one level (from ./foo to ../foo)
      const adjustedText = text.replace(/from\s+["']\.\/([^"']+)["']/g, 'from "../$1"');
      importMap.set(importedName, adjustedText);
    });
  });

  // Build a map of exported names to their identifiers (for local dependencies)
  const exportedNames = new Set<string>();
  sourceFile.getExportedDeclarations().forEach((_declarations, name) => {
    exportedNames.add(name);
  });

  // Extract each exported function/const
  const exports = sourceFile.getExportedDeclarations();
  let count = 0;

  // Extract JSDoc comments for all exports by parsing the full file
  const fullText = sourceFile.getFullText();
  const jsdocMap = new Map<number, string>();

  // Find all JSDoc comments and their positions
  const jsdocRegex = /\/\*\*([\s\S]*?)\*\//g;
  let match;
  while ((match = jsdocRegex.exec(fullText)) !== null) {
    jsdocMap.set(match.index, match[0]);
  }

  exports.forEach((declarations, name) => {
    declarations.forEach((decl) => {
      // Skip type declarations (already handled)
      if (
        decl.isKind(SyntaxKind.TypeAliasDeclaration) ||
        decl.isKind(SyntaxKind.InterfaceDeclaration)
      ) {
        return;
      }

      // Create new file for this export
      const newFileName = join(outputDir, `${name}.ts`);
      const newFile = project.createSourceFile(newFileName, '', { overwrite: true });

      // Find all identifiers used in this declaration
      const usedIdentifiers = new Set<string>();
      decl.getDescendantsOfKind(SyntaxKind.Identifier).forEach((identifier) => {
        const identifierName = identifier.getText();
        if (importMap.has(identifierName)) {
          usedIdentifiers.add(identifierName);
        }
      });

      // Add only the necessary imports
      const addedImports = new Set<string>();
      usedIdentifiers.forEach((identifier) => {
        const importText = importMap.get(identifier);
        if (importText && !addedImports.has(importText)) {
          newFile.addStatements(importText);
          addedImports.add(importText);
        }
      });

      // Check if this declaration uses other exported functions from the same file
      const usedLocalExports = new Set<string>();
      const typeNames = types.length > 0 ? extractTypeNames(types) : [];

      decl.getDescendantsOfKind(SyntaxKind.Identifier).forEach((identifier) => {
        const identifierName = identifier.getText();
        if (exportedNames.has(identifierName) && identifierName !== name) {
          // Skip if it's a type (will be imported from ./types instead)
          if (!typeNames.includes(identifierName)) {
            usedLocalExports.add(identifierName);
          }
        }
      });

      // Add imports for local dependencies (other exports from the same file)
      // Import each function from its own file
      usedLocalExports.forEach((exportName) => {
        newFile.addImportDeclaration({
          moduleSpecifier: `./${exportName}`,
          namedImports: [exportName],
        });
      });

      // Add type imports if types.ts exists
      if (types.length > 0) {
        const usedTypes = new Set<string>();
        decl.getDescendantsOfKind(SyntaxKind.Identifier).forEach((identifier) => {
          const identifierName = identifier.getText();
          if (typeNames.includes(identifierName)) {
            usedTypes.add(identifierName);
          }
        });
        if (usedTypes.size > 0) {
          newFile.addImportDeclaration({
            moduleSpecifier: './types',
            namedImports: Array.from(usedTypes),
          });
        }
      }

      // Get the full text of the declaration including JSDoc comments and export keyword
      let declText = '';

      // Get the full statement text from the source file
      // This includes export, const, etc.
      const parent = decl.getParentIfKind(SyntaxKind.VariableDeclaration);
      if (parent) {
        // This is a variable declaration (const/let/var)
        const statement = parent.getParentIfKind(SyntaxKind.VariableDeclarationList)?.getParent();
        if (statement) {
          // Find JSDoc comment that appears just before this statement
          const statementStart = statement.getStart();

          // Look for JSDoc in the map that appears before this statement
          let closestJsDoc: string | undefined;
          let closestDistance = Infinity;

          jsdocMap.forEach((jsDoc, jsdocPos) => {
            const jsdocEnd = jsdocPos + jsDoc.length;
            // Check if this JSDoc ends before the statement starts
            if (jsdocEnd < statementStart) {
              const distance = statementStart - jsdocEnd;
              // Only consider JSDoc that is within 100 characters before the statement
              // (to avoid picking up JSDoc from previous declarations)
              if (distance < closestDistance && distance < 100) {
                closestDistance = distance;
                closestJsDoc = jsDoc;
              }
            }
          });

          if (closestJsDoc) {
            declText += closestJsDoc + '\n';
          }

          let statementText = statement.getText();
          // Ensure 'const' keyword is present after 'export'
          if (/^export\s+\w+\s*=/.test(statementText)) {
            statementText = statementText.replace(/^export\s+/, 'export const ');
          }
          declText += statementText;
        } else {
          declText += 'export const ' + name + ' = ' + parent.getInitializer()?.getText();
        }
      } else {
        // Function or other declaration
        // Find JSDoc comment that appears just before this declaration
        const declStart = decl.getStart();

        // Look for JSDoc in the map that appears before this declaration
        let closestJsDoc: string | undefined;
        let closestDistance = Infinity;

        jsdocMap.forEach((jsDoc, jsdocPos) => {
          const jsdocEnd = jsdocPos + jsDoc.length;
          // Check if this JSDoc ends before the declaration starts
          if (jsdocEnd < declStart) {
            const distance = declStart - jsdocEnd;
            // Only consider JSDoc that is within 100 characters before the declaration
            if (distance < closestDistance && distance < 100) {
              closestDistance = distance;
              closestJsDoc = jsDoc;
            }
          }
        });

        if (closestJsDoc) {
          declText += closestJsDoc + '\n';
        }

        let functionText = decl.getText();
        // Ensure 'const' keyword is present for arrow functions
        if (/^\w+\s*=/.test(functionText)) {
          functionText = 'const ' + functionText;
        }
        declText += 'export ' + functionText;
      }

      // Add the declaration
      newFile.addStatements(declText);

      console.log(`  ✓ ${name}.ts`);
      count++;
    });
  });

  // Save all new files
  await project.save();

  console.log(`\n✓ Split complete: ${count} files created in ${outputDir}/`);
  console.log(`\nNext: deno run -A generator.ts index ${outputDir}`);

  await createIndex(outputDir);
}

/**
 * Combines multiple TypeScript files from a directory into a single file
 * Usage: deno run -A generator.ts combine path/to/dir
 */
async function combineFiles(dirPath: string): Promise<void> {
  const project = new Project();

  // Read all .ts files in the directory (except index.ts)
  const files: string[] = [];
  const entries = await readdir(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const fullPathStat = await stat(fullPath);
    if (fullPathStat.isFile() && entry.endsWith('.ts') && entry !== 'index.ts') {
      files.push(fullPath);
    }
  }

  if (files.length === 0) {
    console.error(`No TypeScript files found in ${dirPath}`);
    process.exit(1);
  }

  console.log(`Combining ${files.length} files from ${dirPath}/`);

  // Create output file
  const dirName = basename(dirPath);
  const outputPath = join(dirname(dirPath), `${dirName}.ts`);
  const outputFile = project.createSourceFile(outputPath, '', { overwrite: true });

  // Collect all imports and declarations
  const allImports = new Set<string>();
  const allDeclarations: string[] = [];

  files.forEach((filePath) => {
    const sourceFile = project.addSourceFileAtPath(filePath);

    // Collect imports (excluding relative imports to types.ts or similar)
    sourceFile.getImportDeclarations().forEach((imp) => {
      const moduleSpec = imp.getModuleSpecifierValue();
      if (!moduleSpec.startsWith('.')) {
        allImports.add(imp.getText());
      }
    });

    // Collect all exported declarations
    sourceFile.getExportedDeclarations().forEach((declarations) => {
      declarations.forEach((decl) => {
        // Get full text including JSDoc
        let declText = '';
        const leadingComments = decl.getLeadingCommentRanges();
        if (leadingComments.length > 0) {
          const fullText = sourceFile.getFullText();
          leadingComments.forEach((comment) => {
            declText += fullText.slice(comment.getPos(), comment.getEnd()) + '\n';
          });
        }
        declText += decl.getText();
        allDeclarations.push(declText);
      });
    });
  });

  // Add all imports
  allImports.forEach((importText) => {
    outputFile.addStatements(importText);
  });

  // Add empty line
  outputFile.addStatements('');

  // Add all declarations
  allDeclarations.forEach((declText) => {
    outputFile.addStatements(declText);
    outputFile.addStatements(''); // Add spacing between declarations
  });

  await project.save();

  console.log(`\n✓ Combined into ${outputPath}`);
}

/**
 * Creates an index.ts file that re-exports all files in a directory
 * Usage: deno run -A generator.ts index path/to/dir
 */
async function createIndex(dirPath: string): Promise<void> {
  const project = new Project();

  // Read all .ts files in the directory (except index.ts)
  const files: string[] = [];
  const entries = await readdir(dirPath);
  for (const entry of entries) {
    const fullPath = join(dirPath, entry);
    const fullPathStat = await stat(fullPath);
    if (fullPathStat.isFile() && entry.endsWith('.ts') && entry !== 'index.ts') {
      files.push(entry.replace('.ts', ''));
    }
  }

  if (files.length === 0) {
    console.error(`No TypeScript files found in ${dirPath}`);
    process.exit(1);
  }

  console.log(`Creating index.ts with ${files.length} exports in ${dirPath}/`);

  // Create index.ts
  const indexPath = join(dirPath, 'index.ts');
  const indexFile = project.createSourceFile(indexPath, '', { overwrite: true });

  // Add re-exports for each file
  files.sort().forEach((fileName) => {
    indexFile.addExportDeclaration({
      moduleSpecifier: `./${fileName}`,
    });
    console.log(`  ✓ export * from './${fileName}';`);
  });

  await project.save();

  console.log(`\n✓ Index created: ${indexPath}`);
}

/**
 * Extract type names from type declaration strings
 */
function extractTypeNames(types: string[]): string[] {
  const names: string[] = [];
  types.forEach((typeText) => {
    const match = typeText.match(/(?:export\s+)?(?:type|interface)\s+(\w+)/);
    if (match && match[1]) {
      names.push(match[1]);
    }
  });
  return names;
}

// Main CLI
async function main() {
  const command = process.argv[2];
  const target = process.argv[3];

  if (!command || !target) {
    console.error(`
Usage:
  npx tsx generator.ts split <file>     Split file into multiple files
  npx tsx generator.ts combine <dir>    Combine directory files into one
  npx tsx generator.ts index <dir>      Create index.ts with re-exports

Examples:
  npx tsx generator.ts split src/color.ts
  npx tsx generator.ts index src/color
  npx tsx generator.ts combine src/color
    `);
    process.exit(1);
  }

  try {
    switch (command) {
      case 'split':
        await splitFile(target);
        break;
      case 'combine':
        await combineFiles(target);
        break;
      case 'index':
        await createIndex(target);
        break;
      default:
        console.error(`Unknown command: ${command}`);
        console.error(`Valid commands: split, combine, index`);
        process.exit(1);
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

main();
