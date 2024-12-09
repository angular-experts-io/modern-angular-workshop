import { Project } from "ts-morph";

function migratePrivateToHash() {
  // Initialize the project
  const project = new Project();
  project.addSourceFilesAtPaths("exercise-*/projects/**/*.ts"); // Adjust the path to your source files

  const sourceFiles = project.getSourceFiles();

  sourceFiles.forEach((sourceFile) => {
    console.log(`Processing file: ${sourceFile.getFilePath()}`);
    const classes = sourceFile.getClasses();

    classes.forEach((cls) => {
      const properties = cls.getProperties();

      properties.forEach((prop) => {
        // Check if the property is marked as private
        if (prop.hasModifier("private")) {
          const propName = prop.getName();
          const newPropName = `#${propName}`;

          console.log(`Migrating private property "${propName}" to "${newPropName}"`);

          // Rename the field to #privateField
          prop.rename(newPropName);

          // Remove the `private` modifier
          prop.toggleModifier("private", false);

          // Update all references within the class
          const references = cls.findReferences();
          references.forEach((ref) => {
            ref.getReferences().forEach((refNode) => {
              const refIdentifier = refNode.getNode();
              if (refIdentifier.getText() === propName) {
                refIdentifier.replaceWithText(newPropName);
              }
            });
          });
        }
      });
    });
  });

  // Save changes
  console.log("Saving changes...");
  project.saveSync();
  console.log("Migration complete!");
}

migratePrivateToHash();
