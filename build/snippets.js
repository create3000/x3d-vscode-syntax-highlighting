const
   X3D  = require ("x_ite-node"),
   path = require ("path"),
   fs   = require ("fs");

main ();

async function main ()
{
   console .log ("Generating Snippets ...");

   const
      template = path .resolve (__dirname, "../src/snippets-template.json"),
      filename = path .resolve (__dirname, "../src/snippets.json"),
      snippets = require (template);

   const
      canvas  = X3D .createBrowser (),
      browser = canvas .browser;

   await browser .loadComponents (browser .getProfile ("Full"), browser .getComponent ("X_ITE"));

   for (const { typeName } of browser .fieldTypes)
   {
      snippets [typeName] = {
         prefix: typeName,
         description: "",
         body: [
            typeName,
         ],
      };
   }

   for (const typeName of Array .from (browser .concreteNodes, Type => Type .typeName) .sort ())
   {
      snippets [typeName] = {
         prefix: typeName,
         description: "",
         body: [
            typeName + " { ${1:}}",
         ],
      };
   }

   const fieldNames = new Set (Array .from (browser .concreteNodes)
      .flatMap (Type => Array .from (Type .fieldDefinitions, fieldDefinition => fieldDefinition .name))
      .sort ());

   for (const name of fieldNames)
   {
      snippets [name] = {
         prefix: name,
         description: "",
         body: [
            name,
         ],
      };
   }

   fs .writeFileSync (filename, JSON .stringify (snippets, null, 2));
}
