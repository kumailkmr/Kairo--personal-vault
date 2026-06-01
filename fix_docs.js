const fs = require('fs');

let content = fs.readFileSync('src/services/document.service.ts', 'utf8');

// Replace imports
content = content.replace(
  'import { supabase, isMockMode, localDb } from "@/lib/supabase";',
  'import { supabase } from "@/lib/supabase";'
);
content = content.replace(
  'import { MOCK_TEMPLATES, MockDocument, MockTemplate, DocStatus, DocType } from "@/mock/documents";',
  '// MOCK_TEMPLATES removed\ntype DocStatus = any;\ntype DocType = any;\ntype MockTemplate = any;\ntype MockDocument = any;'
);

// logDocumentActivity mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?\} else \{\n    try \{\n      if \(clientId\) \{\n        await supabase\.from\("client_activity_logs"\)\.insert\(\{\n          client_id: clientId,\n          user_id: userId,\n          action,\n          details\n        \}\);\n      \}\n    \} catch \(err\) \{\n      console\.error\("Failed to persist operational audit log to Supabase:", err\);\n    \}\n  \}/,
  `try {
      if (clientId) {
        await supabase.from("client_activity_logs").insert({
          client_id: clientId,
          user_id: userId,
          action,
          details
        });
      }
    } catch (err) {
      console.error("Failed to persist operational audit log to Supabase:", err);
    }`
);

// getTemplates mock
content = content.replace(
  /if \(isMockMode\) \{\n      return MOCK_TEMPLATES;\n    \}\n\n    try \{/,
  'try {'
);
content = content.replace(
  /const seededTemplates = MOCK_TEMPLATES\.map\([\s\S]*?return MOCK_TEMPLATES;\n      \}/,
  '/* seed templates removed */'
);
content = content.replace(
  /return MOCK_TEMPLATES;\n    \}/,
  'return [];\n    }'
);

// getDocuments mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?\}\);\n    \}\n\n    const \{ data, error \} = await supabase/,
  'const { data, error } = await supabase'
);

// generateDocument mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?return \{[\s\S]*?\}\;\n    \}\n\n    \/\/ 1\. Upload HTML document/,
  '// 1. Upload HTML document'
);

// uploadAttachment mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?return \{[\s\S]*?\}\;\n    \}\n\n    const \{ error: uploadError \} = await supabase/,
  'const { error: uploadError } = await supabase'
);

// getDownloadUrl mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?return "data:application\/pdf;base64,[\s\S]*?";\n    \}\n\n    const \{ data, error \} = await supabase/,
  'const { data, error } = await supabase'
);

// createDocumentRevision mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?return 2; \/\/ Simulated new version number\n    \}\n\n    \/\/ 1\. Fetch document information/,
  '// 1. Fetch document information'
);

fs.writeFileSync('src/services/document.service.ts', content);
