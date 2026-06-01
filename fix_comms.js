const fs = require('fs');

let content = fs.readFileSync('src/services/comms.service.ts', 'utf8');

// Replace imports
content = content.replace(
  'import { supabase, isMockMode, localDb } from "@/lib/supabase";',
  'import { supabase } from "@/lib/supabase";'
);

// Remove mock arrays
content = content.replace(/\/\/ Initialize mock data collections inside localDb if they are missing[\s\S]*?\n\/\/ Activity Logging helper specifically for Communications/, '// Activity Logging helper specifically for Communications');

// logCommsActivity mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?\} else \{\n    try \{\n      if \(clientId\) \{\n        await supabase\.from\("client_activity_logs"\)\.insert\(\{\n          client_id: clientId,\n          user_id: logEntry\.user_id,\n          action,\n          details\n        \}\);\n      \}\n    \} catch \(err\) \{\n      console\.error\("Failed to persist comms audit activity log:", err\);\n    \}\n  \}/,
  `try {
      if (clientId) {
        await supabase.from("client_activity_logs").insert({
          client_id: clientId,
          user_id: logEntry.user_id,
          action,
          details
        });
      }
    } catch (err) {
      console.error("Failed to persist comms audit activity log:", err);
    }`
);

// triggerCommsNotification mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?\} else \{\n    try \{\n      await supabase\.from\("notifications"\)\.insert\(\{\n        user_id: "c76fb973-ec63-41c4-b816-56be794c483d",\n        title,\n        message,\n        priority: priority\.toUpperCase\(\)\n      \}\);\n    \} catch \(err\) \{\n      console\.error\("Failed to generate communications notification:", err\);\n    \}\n  \}/,
  `try {
      await supabase.from("notifications").insert({
        user_id: "c76fb973-ec63-41c4-b816-56be794c483d",
        title,
        message,
        priority: priority.toUpperCase()
      });
    } catch (err) {
      console.error("Failed to generate communications notification:", err);
    }`
);

// getOnboardingRequests mock
content = content.replace(
  /if \(isMockMode\) \{\n      return \(localDb as any\)\.onboardingRequests;\n    \}\n\n    const \{ data, error \} = await supabase/,
  'const { data, error } = await supabase'
);

// createOnboardingRequest mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?return mockRequest;\n    \}\n\n    const \{ data, error \} = await supabase/,
  'const { data, error } = await supabase'
);

// updateOnboardingStatus mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?return req;\n    \}\n\n    const \{ data, error \} = await supabase/,
  'const { data, error } = await supabase'
);

// getCommunicationLogs mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?\} \}\);\n    \}\n\n    const \{ data, error \} = await supabase/,
  'const { data, error } = await supabase'
);
content = content.replace(
  /if \(isMockMode\) \{\n      return \(localDb as any\)\.communicationLogs\.map\(\(log: any\) => \{\n        const clientObj = localDb\.clients\.find\(c => c\.id === log\.client_id\);\n        return \{\n          \.\.\.log,\n          clientName: clientObj\?\.company \|\| "Strategic Guest"\n        \};\n      \}\);\n    \}\n\n    const \{ data, error \} = await supabase/,
  'const { data, error } = await supabase'
);

// sendOutboundMessage mock
content = content.replace(
  /if \(isMockMode\) \{[\s\S]*?return mockLog;\n    \}\n\n    \/\/ 1\. Write core timeline transaction to communication_logs/,
  '// 1. Write core timeline transaction to communication_logs'
);

fs.writeFileSync('src/services/comms.service.ts', content);
