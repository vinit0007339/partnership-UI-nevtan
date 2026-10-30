import { appByCode } from './products';

// Content for the /products/[slug] pages. One template renders every product, so adding a
// product page means adding an entry here — no new page code.
//
// Copied as-is from NevTan Workspace (workspace-nevtan-UI/src/lib/products.js) so the partner
// site describes each app exactly as Workspace does. When Workspace's copy changes, copy it again.
//
// Copy comes from each product's own site and docs (mail.nevtan.com/docs, drive.nevtan.com/docs,
// sign.nevtan.com, engage.nevtan.com/docs, cloud.nevtan.com/docs, ai.nevtan.com, office.nevtan.com).
// Where a product's pages contradict each other, the claim is left out rather than picked.
// Plans, prices and per-plan limits are NOT written here: the page reads them from
// /api/public/pricing, so they always match what Workspace actually sells.
// Keep it in step with what the product actually does.
//
// `demo` drives the animated hero window; its rows mirror the mock on each product's own site.
// `image` fields take a path under /public — until a real screenshot is added, the feature
// tour shows its points instead of a made-up UI.

const PRODUCTS = {
  mail: {
    code: 'MAIL',
    metaDescription: 'NevTan Mail gives your team business email on your own domain, with guided DNS setup, admin controls, calendar and mail import.',
    headline: 'Business email on your own domain',
    lead: 'Inboxes, custom domains and admin controls in one focused workspace. Add your domain, follow the guided DNS check and create mailboxes for your team.',
    highlights: ['Your own domain', 'Guided DNS setup', 'Storage shared with Drive'],
    docsUrl: 'https://mail.nevtan.com/docs',
    demo: {
      title: 'Inbox',
      sidebar: ['Inbox', 'Starred', 'Sent', 'Drafts', 'Spam'],
      rows: [
        { a: 'Nina Carter', b: 'Q2 launch approvals', tag: '2m' },
        { a: 'Billing', b: 'Subscription receipt', tag: '18m' },
        { a: 'IT Admin', b: 'DNS verification complete', tag: 'Verified', tone: 'success' },
        { a: 'Priya Nair', b: 'Signed agreement attached', tag: '1h' },
      ],
      toast: 'Domain verified · MX, SPF, DKIM and DMARC',
    },
    features: {
      title: 'Email your business can run on',
      lead: 'Domains, mailboxes, calendar and admin tools, in one place.',
      items: [
        { title: 'Your company domain', text: 'Add a domain under Admin → Domain and follow the DNS screen until every record shows Verified.' },
        { title: 'Mailboxes for your team', text: 'Create a mailbox with a name, password and status. An inactive mailbox can’t sign in.' },
        { title: 'Admin roles', text: 'Promote teammates to admin from the mailbox editor. Revoking admin signs them out.' },
        { title: 'Calendar and meetings', text: 'Recurring meetings, time zones and in-app reminders, with Google Calendar and Meet support.' },
        { title: 'Tasks, notes and contacts', text: 'Tasks, Keep notes and contacts sit alongside your inbox.' },
        { title: 'Bring your old mail', text: 'Import over IMAP from Google, Yahoo or Zoho and follow each job as it runs.' },
      ],
    },
    spotlights: [
      {
        id: 'domains',
        eyebrow: 'Domains and DNS',
        title: 'Connect your domain with a guided check',
        text: 'Copy each record into your DNS provider and watch the domain move from Pending to Verified.',
        points: ['MX, SPF, DKIM and DMARC records', 'Copy buttons on every record', 'A Verified or Not found yet badge per record', 'Mailbox usage and storage per domain'],
        image: null,
      },
      {
        id: 'admin',
        eyebrow: 'Admin console',
        title: 'Mailboxes and roles in one place',
        text: 'Admins land in the admin area when they sign in, with Domain, Mailbox and Subscription close at hand.',
        points: ['Add a mailbox with name, password and status', 'Turn a mailbox off to block sign-in', 'Promote or revoke admins'],
        image: null,
      },
      {
        id: 'import',
        eyebrow: 'Switching to NevTan Mail',
        title: 'Bring your old mail with you',
        text: 'Start an import from Settings → Import mail and keep working while it runs.',
        points: ['Imports from Google, Yahoo and Zoho', 'Up to 500 MB per import job', 'A jobs panel that shows progress', 'Trash keeps deleted mail for 30 days'],
        image: null,
      },
    ],
    worksWith: [
      { code: 'DRIVE', text: 'Large attachments are saved to Drive and sent as a share link, and both apps draw on one storage total.' },
    ],
    security: {
      title: 'Protected from the first email',
      lead: 'Encryption in transit, strong passwords and one sign-out for the whole suite.',
      items: [
        { title: 'TLS everywhere', text: 'HTTPS for the app, STARTTLS for outgoing mail and IMAPS for imports.' },
        { title: 'Strong passwords', text: '8 to 64 characters with upper and lower case, a number and a symbol.' },
        { title: 'Hashed passwords', text: 'Passwords are stored hashed with bcrypt, never in plain text.' },
        { title: 'Time-limited sessions', text: 'Sessions expire, and reset links stop working after a while.' },
        { title: 'Sender blocklist', text: 'Block a sender or a whole domain and their mail goes straight to Spam.' },
        { title: 'One sign-out', text: 'Signing out of Mail signs you out of every NevTan app.' },
      ],
    },
    faq: [
      { q: 'Do I need my own domain?', a: 'Yes. NevTan Mail is built around your company domain. Add it under Admin → Domain and follow the DNS check.' },
      { q: 'Can I move my mail from Gmail?', a: 'Yes. Import over IMAP from Google, Yahoo or Zoho, up to 500 MB per import job.' },
      { q: 'Is my storage shared with Drive?', a: 'Yes. Mail and Drive share one quota per mailbox, and you’re warned at 85%, 90% and 95%.' },
    ],
  },

  drive: {
    code: 'DRIVE',
    metaDescription:
      'NevTan Drive stores, previews, edits and shares your files in the browser, with PDF, document, spreadsheet and presentation editors built in.',
    headline: 'Every file, organized, edited and shared',
    lead: 'Preview almost anything in one click, edit PDFs, documents, spreadsheets and presentations right in the browser, and share exactly what you mean to.',
    highlights: ['Password-protected links', 'Expiring share links', 'Per-file audit log'],
    docsUrl: 'https://drive.nevtan.com/docs',
    demo: {
      title: 'My Drive',
      sidebar: ['My Drive', 'Shared with me', 'Recent', 'Starred', 'Trash'],
      rows: [
        { a: 'Client Contracts', b: '18 files · Updated today', tag: 'Folder' },
        { a: 'Signed_Agreement.pdf', b: '2.4 MB', tag: 'Shared', tone: 'primary' },
        { a: 'Q3_Revenue.xlsx', b: '948 KB' },
        { a: 'Proposal_Draft.docx', b: '312 KB' },
      ],
      toast: 'Shared with Sam · Editor access',
    },
    features: {
      title: 'Everything a file needs, in one place',
      lead: 'Organize, preview, edit, comment and share, without bouncing between apps.',
      items: [
        { title: 'Find anything fast', text: 'Drag-and-drop and folder uploads, plus instant search by name, keep thousands of files easy to scan.' },
        { title: 'Preview almost anything', text: 'Images, video, audio, code and Office documents open right in the browser. No downloads, no waiting.' },
        { title: 'A real editor for every format', text: 'Mark up and sign PDFs, or write, calculate and present in editors that export real files.' },
        { title: 'Control who sees what', text: 'Invite by role, or send links you can expire, password-protect or set to preview-only.' },
        { title: 'Comment where the work lives', text: 'Comments stay attached to the file itself, so feedback never gets lost in a side channel.' },
        { title: 'Right where you left it', text: 'Jump back into recent work, star what matters, and restore anything from Trash.' },
      ],
    },
    spotlights: [
      {
        id: 'editing',
        eyebrow: 'PDF editor',
        title: 'A real PDF editor, not just a viewer',
        text: 'Edit existing text right on the page, mark it up, draw, drop in shapes and add a signature, then manage pages without opening a desktop app.',
        points: ['Type or draw directly onto existing PDF text', 'Highlight, underline and strikethrough in one click', 'Draw or upload an e-signature', 'Add, delete, rotate, reorder and extract pages'],
        image: null,
      },
      {
        id: 'sharing',
        eyebrow: 'Sharing and permissions',
        title: 'Share with exactly the right level of access',
        text: 'Invite people by email as Viewer, Commenter or Editor, or send a link with an expiry date, a password and download controls.',
        points: ['Viewer, Commenter and Editor roles', 'Links with expiry, password and download control', 'Transfer ownership of any file', 'Every share and permission change is logged'],
        image: null,
      },
      {
        id: 'suite',
        eyebrow: 'Document suite',
        title: 'Write, calculate and present in your browser',
        text: 'A document editor, a spreadsheet editor with real formulas and a presentation editor with themes and speaker notes.',
        points: ['Documents with tables and templates', 'Spreadsheets with live formulas', 'Presentations with themes, notes and present mode', 'Exports real .docx, .xlsx and .pptx files'],
        image: null,
      },
    ],
    worksWith: [
      { code: 'MAIL', text: 'Drive and Mail share one storage total, and large Mail attachments are stored in Drive and sent as a share link.' },
      { code: 'SIGN', text: 'When a PDF needs more than one signer, the Drive PDF editor hands it to NevTan Sign.' },
    ],
    security: {
      title: 'Access control that is actually enforced',
      lead: 'Every safeguard runs on the file itself, not just the screen around it.',
      items: [
        { title: 'Signed in by default', text: 'Private files and folders are only ever visible behind a signed-in Drive session.' },
        { title: 'Expiring links', text: 'Set a link to stop working after a date, so access does not outlive the project.' },
        { title: 'Password-protected links', text: 'Add a password to any share link for files that need one more gate.' },
        { title: 'Preview-only sharing', text: 'Share a link that can be read in the browser but not downloaded.' },
        { title: 'Role-based access', text: 'Viewer, Commenter or Editor, so people get exactly the access they need.' },
        { title: 'Per-file audit log', text: 'Every share, permission change and access event is recorded against the file.' },
      ],
    },
    faq: [
      { q: 'What is NevTan Drive?', a: 'A cloud file workspace that stores, organizes, previews, edits and shares your files in the browser. PDF, document, spreadsheet and presentation editors are built in.' },
      { q: 'What files can I preview and edit?', a: 'Images, PDFs, video, audio, code and Office documents open in the browser. PDFs can be edited and signed, and the editors export real .docx, .xlsx and .pptx files. Single uploads can be up to 100 MB.' },
      { q: 'How do I control who can see a file?', a: 'Invite people as Viewer, Commenter or Editor, or send a link with an expiry date and a password. You can transfer ownership and turn downloads off, and every change is recorded in the file’s audit log.' },
      { q: 'Is my storage shared with NevTan Mail?', a: 'Yes. Drive and Mail use one combined storage total, so both show the same number.' },
    ],
  },

  engage: {
    code: 'ENGAGE',
    metaDescription: 'NevTan Engage runs email, SMS and WhatsApp campaigns with verified sending domains, segments, automations and team roles.',
    headline: 'Campaigns your customers actually open',
    lead: 'Reach your customers with on-time email, SMS and WhatsApp campaigns, and track every open, click and bounce in one place.',
    highlights: ['Verified sending domains', 'Automatic suppression list', 'Team roles'],
    docsUrl: 'https://engage.nevtan.com/docs',
    demo: {
      title: 'Campaigns',
      sidebar: ['Dashboard', 'Campaigns', 'Contacts', 'Automations', 'Templates'],
      rows: [
        { a: 'October newsletter', b: 'Email · Segment: All subscribers', tag: 'Sent', tone: 'success' },
        { a: 'Flash sale reminder', b: 'SMS · Segment: Active buyers', tag: 'Scheduled', tone: 'warning' },
        { a: 'Welcome series', b: 'Automation · 3 steps', tag: 'Running', tone: 'primary' },
        { a: 'Order follow-up', b: 'WhatsApp · Awaiting approval', tag: 'Draft' },
      ],
      toast: 'Campaign sent · tracking opens and clicks',
    },
    features: {
      title: 'Every channel, one place',
      lead: 'Build, approve, send and measure campaigns without switching tools.',
      items: [
        { title: 'Email campaigns', text: 'Design with templates, send on time and track every open, click and bounce.' },
        { title: 'SMS and WhatsApp', text: 'Reach customers on the channels they read first, from the same account.' },
        { title: 'Lists and segments', text: 'Group contacts into lists and segments so each campaign reaches the right people.' },
        { title: 'Automations', text: 'Set up flows that send the right message when a customer does something.' },
        { title: 'Approval before sending', text: 'Templates need an admin’s approval, and campaigns can be set to need one too.' },
        { title: 'Contact import', text: 'Upload a CSV of up to 50 MB and map its columns to your contact fields.' },
      ],
    },
    spotlights: [
      {
        id: 'domains',
        eyebrow: 'Sending domains',
        title: 'Send from your own verified domain',
        text: 'Add a domain under Account → Domains, copy the records into your DNS and verify it.',
        points: ['SPF, DKIM and DMARC records to copy', 'DKIM status on every domain', 'Sender addresses unlock once the domain is verified'],
        image: null,
      },
      {
        id: 'audience',
        eyebrow: 'Audience',
        title: 'Keep your lists clean on their own',
        text: 'Bounces, complaints and unsubscribes are suppressed automatically, so you stay off spam lists.',
        points: ['CSV import with column mapping', 'Lists and segments', 'An automatic suppression list', 'Consent tracked per channel'],
        image: null,
      },
      {
        id: 'team',
        eyebrow: 'Team and API',
        title: 'Work as a team, build with the API',
        text: 'Invite colleagues with the right role, and connect your own systems with API keys and webhooks.',
        points: ['Invite members from Team & Roles', 'Roles for every teammate', 'API keys shown once and stored hashed'],
        image: null,
      },
    ],
    worksWith: [
      { code: 'SIGN', text: 'NevTan Sign lists Engage as a live integration, so agreements and campaigns stay in one suite.' },
    ],
    security: {
      title: 'Controls built for teams',
      lead: 'Account security an admin can enforce, not just recommend.',
      items: [
        { title: 'Multi-factor sign-in', text: 'TOTP and SMS verification, and admins can make it mandatory for everyone.' },
        { title: 'Roles and permissions', text: 'Give each teammate a role with the access they need.' },
        { title: 'Session control', text: 'Configurable session expiry, and admins can end active sessions remotely.' },
      ],
    },
    faq: [
      { q: 'Do I need my own domain to send?', a: 'Yes. Verify a sending domain under Account → Domains first. Sender addresses can only be added once it’s verified.' },
      { q: 'How does the suppression list work?', a: 'Bounces, complaints and unsubscribes are added automatically, so those contacts aren’t mailed again.' },
      { q: 'Can I import my contacts?', a: 'Yes. Upload a CSV of up to 50 MB and map each column to a contact field.' },
      { q: 'Does Engage have an API?', a: 'Yes. Create API keys and webhooks from your account once NevTan turns API access on for your company.' },
    ],
  },

  sign: {
    code: 'SIGN',
    metaDescription: 'NevTan Sign sends documents for legally binding e-signature, with templates, reminders, audit trails and an API.',
    headline: 'Send documents and get them signed',
    lead: 'Upload a document, place the fields, route it to every signer and get back a signed PDF with its full audit trail.',
    highlights: ['Legally binding eSignatures', 'Audit trail on every document', 'Reusable templates'],
    docsUrl: 'https://sign.nevtan.com/support',
    docsLabel: 'Visit NevTan Sign support',
    demo: {
      title: 'Envelopes',
      sidebar: ['Dashboard', 'Upload', 'Templates', 'Workspaces', 'Analytics'],
      rows: [
        { a: 'Master services agreement', b: '3 of 3 signers complete', tag: 'Completed', tone: 'success' },
        { a: 'Offer letter', b: 'Waiting for 1 signer', tag: 'Sent', tone: 'warning' },
        { a: 'Vendor NDA', b: 'Fields placed, ready to route', tag: 'Draft' },
        { a: 'Lease renewal', b: 'Reminder scheduled', tag: 'Sent', tone: 'warning' },
      ],
      toast: 'Agreement signed · signed PDF delivered',
    },
    features: {
      title: 'Move agreements forward',
      lead: 'Prepare the packet, route it, collect signatures and close the loop with a reliable record.',
      items: [
        { title: 'Upload anything', text: 'Add PDFs or images and create an envelope in a few clicks.' },
        { title: 'Drag-and-drop fields', text: 'Place signature, date, initials and signer-specific fields on the document.' },
        { title: 'Route to every signer', text: 'Send to one signer or many, with role-based ownership and status tracking.' },
        { title: 'Templates', text: 'Save the documents you send often and share templates with your team.' },
        { title: 'Reminders and expiry', text: 'Set reminder schedules and expiration dates so nothing stalls.' },
        { title: 'AI that reads the fine print', text: 'See the risky clauses before anyone signs.' },
      ],
    },
    spotlights: [
      {
        id: 'workflow',
        eyebrow: 'How it works',
        title: 'Four steps from blank document to signed agreement',
        text: 'NevTan Sign keeps the core jobs simple, from upload to a signed PDF ready to download.',
        points: ['Upload PDFs or images', 'Place signature, date and initials fields', 'Route to one or many signers', 'Deliver the signed PDF with its history'],
        image: null,
      },
      {
        id: 'audit',
        eyebrow: 'Audit trail',
        title: 'Every signature leaves a record',
        text: 'Audit records cover the whole life of a document, so you can prove what happened and when.',
        points: ['Creation, delivery and signatures with timestamps', 'A certificate of completion', 'Tamper-evident completed documents'],
        image: null,
      },
    ],
    worksWith: [
      { code: 'CLOUD', text: 'NevTan Sign connects to NevTan Cloud as a live integration.' },
      { code: 'ENGAGE', text: 'NevTan Sign connects to NevTan Engage as a live integration.' },
    ],
    security: {
      title: 'Security built into every signature',
      lead: 'Technical, administrative and operational safeguards for sensitive agreements.',
      items: [
        { title: 'Encryption', text: 'Data is encrypted in transit and at rest, including documents, audit records and backups.' },
        { title: 'Role-based access', text: 'People get permissions based on their role, and only what they need.' },
        { title: 'Signer authentication', text: 'Require signers to authenticate, and protect documents with a password.' },
        { title: 'Session security', text: 'Controls protect active sessions and reduce the risk of account takeover.' },
        { title: 'Detailed audit records', text: 'Every document and transaction keeps a record of who did what and when.' },
        { title: 'Responsible disclosure', text: 'Security reports are investigated promptly by the NevTan Sign security team.' },
      ],
    },
    faq: [
      { q: 'Are NevTan Sign signatures legally binding?', a: 'Yes. NevTan Sign supports the US ESIGN Act and UETA, with eIDAS-basic consent capture.' },
      { q: 'Can I reuse documents I send often?', a: 'Yes. Save them as templates and share templates with your team.' },
    ],
  },

  cloud: {
    code: 'CLOUD',
    metaDescription: 'NevTan Cloud runs AI inference, apps, managed databases, GPUs and sandboxes from one console, on one bill.',
    headline: 'Inference, apps and databases on one cloud',
    lead: 'Call open models, deploy your app and attach a managed database from one console, on one bill, under one identity.',
    highlights: ['OpenAI-compatible inference', 'Managed databases', 'Team audit log'],
    docsUrl: 'https://cloud.nevtan.com/docs',
    demo: {
      title: 'Projects',
      sidebar: ['Overview', 'App Platform', 'Databases', 'Inference', 'Monitoring'],
      rows: [
        { a: 'storefront-web', b: 'App Platform · Next.js · main', tag: 'Live', tone: 'success' },
        { a: 'orders-db', b: 'Managed Postgres · daily backups', tag: 'Healthy', tone: 'success' },
        { a: 'support-bot', b: 'Inference · Llama 3 70B', tag: 'Serving', tone: 'primary' },
        { a: 'api-gateway', b: 'App Platform · deploy in progress', tag: 'Building', tone: 'warning' },
      ],
      toast: 'storefront-web deployed · build passed',
    },
    features: {
      title: 'Everything your app needs to run',
      lead: 'Stop stitching three vendors into every project.',
      items: [
        { title: 'App Platform', text: 'Deploy from git or a Dockerfile, with auto-deploy, custom domains and autoscaling.' },
        { title: 'Managed databases', text: 'Postgres, MySQL, MongoDB and Redis, with IP allowlists.' },
        { title: 'GPU instances', text: 'On-demand H100 and A100 instances you reach over SSH.' },
        { title: 'AI Gateway', text: 'An OpenAI-compatible proxy that uses your own provider keys.' },
        { title: 'Sandboxes', text: 'Firecracker microVMs with snapshots and templates.' },
        { title: 'Monitoring', text: 'Container metrics, plus uptime checks for your external apps.' },
      ],
    },
    spotlights: [
      {
        id: 'ai',
        eyebrow: 'AI',
        title: 'Run models without another vendor',
        text: 'Inference, model servers, retrieval and fine-tuning live next to your app and its database.',
        points: ['OpenAI-compatible inference for open models', 'Model servers on a GPU you launch', 'RAG collections with hybrid search', 'LoRA, QLoRA and full fine-tuning'],
        image: null,
      },
      {
        id: 'teams',
        eyebrow: 'Teams',
        title: 'Share projects with your team',
        text: 'Invite teammates by email and share the resources they need, in a team workspace.',
        points: ['Share projects, databases and GPUs with a team', 'Personal and team workspaces', 'Pending invitations you can revoke'],
        image: null,
      },
    ],
    worksWith: [
      { code: 'SIGN', text: 'NevTan Sign connects to NevTan Cloud as a live integration.' },
    ],
    security: {
      title: 'Security you can audit',
      lead: 'Know who did what, and keep keys and access tight.',
      items: [
        { title: 'Two-factor sign-in', text: 'TOTP codes with one-time backup codes for every account.' },
        { title: 'Tamper-evident audit log', text: 'Sign-ins, key changes, resource changes and team changes, with CSV export.' },
        { title: 'Scoped API keys', text: 'Limit a key to a single project, and revoke it instantly.' },
        { title: 'Encryption', text: 'AES-256 at rest and TLS 1.2 or later in transit.' },
        { title: 'Database IP allowlists', text: 'Only the sources you trust can reach your databases.' },
      ],
    },
    faq: [
      { q: 'Which databases can I run?', a: 'Managed Postgres, MySQL, MongoDB and Redis.' },
      { q: 'Can my team share resources?', a: 'Yes. Create a team, invite people by email and share projects, databases and GPU instances with it.' },
    ],
  },

  ai: {
    code: 'AI',
    metaDescription: 'NevTan AI finds, installs and runs open AI models on your own computer. Free, with nothing charged per message.',
    headline: 'Open AI models, running on your own computer',
    lead: 'NevTan AI checks what your hardware can handle, installs the model for you and answers locally. No subscription, and nothing charged per message.',
    highlights: ['Answers stay on your device', 'Free, no per-message cost', 'Available on macOS'],
    primaryCta: 'Get NevTan AI free',
    demo: {
      title: 'Models for this Mac',
      sidebar: ['Chat', 'Models', 'Devices', 'API keys'],
      rows: [
        { a: 'Llama', b: 'Chat · installed', tag: 'Ready', tone: 'success' },
        { a: 'Qwen Coder', b: 'Coding · runs well on this Mac', tag: 'Recommended', tone: 'primary' },
        { a: 'Gemma', b: 'Chat · one-click install', tag: 'Available' },
        { a: 'Mistral', b: 'Chat · one-click install', tag: 'Available' },
      ],
      toast: 'Answered locally · nothing left this device',
    },
    features: {
      title: 'Local AI without the setup',
      lead: 'Running a model normally means file formats, memory limits and a command line. NevTan AI does that for you.',
      items: [
        { title: 'Checks your hardware first', text: 'It reads your processor, memory and free disk, then shows which models will run well.' },
        { title: 'One-click install', text: 'Pick a model for the task in front of you and install it in one click.' },
        { title: 'Chat and coding models', text: 'Qwen, Llama, Gemma, Mistral and Phi for chat, and Qwen Coder, DeepSeek Coder, Devstral and CodeGemma for code.' },
        { title: 'Conversations you can find', text: 'Conversations are saved, searchable and easy to pick up again.' },
        { title: 'Switch models mid-chat', text: 'Move a conversation to a bigger model without starting over.' },
        { title: 'Use it from your editor', text: 'Create an API key and point any OpenAI-compatible tool at NevTan AI.' },
      ],
    },
    spotlights: [
      {
        id: 'hardware',
        eyebrow: 'Made for your machine',
        title: 'Models matched to what your computer can run',
        text: 'See the memory and disk each model needs, and whether your computer meets them, before you download anything.',
        points: ['Reads processor, memory and free disk', 'Recommends models that will run well', 'Shows requirements before you download', 'Keeps track of model files and updates'],
        image: null,
      },
      {
        id: 'private',
        eyebrow: 'Private by design',
        title: 'Answers generated on your own machine',
        text: 'Models running on your hardware carry no per-message charge, and your conversations stay with you.',
        points: ['Local models answer on your computer', 'Nothing charged per message', 'Hosted models only with your own API key', 'Asks before it changes anything on your computer'],
        image: null,
      },
      {
        id: 'developers',
        eyebrow: 'For developers',
        title: 'Your models, in your tools',
        text: 'Choose the NevTan AI provider in NevTan Code or the extension, or use any OpenAI-compatible tool.',
        points: ['API keys for editors and other tools', 'An OpenAI-compatible base URL', 'Works with NevTan Code and the NevTan AI extension', 'Requests and tokens across all your keys'],
        image: null,
      },
    ],
    worksWith: [],
    security: {
      title: 'Your machine, your rules',
      lead: 'NevTan AI runs on hardware you own and asks before it acts.',
      items: [
        { title: 'Local answers', text: 'Local models generate answers on your own computer.' },
        { title: 'Asks first', text: 'NevTan AI asks before it changes anything on your computer.' },
        { title: 'Keys shown once', text: 'Copy a new API key when you create it. It can’t be shown again.' },
        { title: 'Revocable keys', text: 'Anyone with a key can use your model quota, so revoke keys you no longer use.' },
        { title: 'Short-lived pairing codes', text: 'A device pairing code works once and expires in ten minutes.' },
        { title: 'One NevTan account', text: 'The same sign-in you use for every NevTan product.' },
      ],
    },
    faq: [
      { q: 'How much does NevTan AI cost?', a: 'Nothing. There is no subscription and nothing is charged per message for models it runs locally. Hosted models are billed by whichever provider issued the API key you connect.' },
      { q: 'Which computers does it run on?', a: 'NevTan AI is available on macOS today. Windows and Linux downloads are being built now.' },
      { q: 'Does it use my graphics card?', a: 'It detects your graphics card today, but GPU acceleration is still being built. Recommendations are based on system memory for now.' },
      { q: 'Can I use a hosted model instead?', a: 'Yes. Connect a hosted model with your own API key, and that provider bills you directly.' },
      { q: 'Is NevTan AI part of my NevTan account?', a: 'Yes. One account works across every NevTan product.' },
    ],
  },

  office: {
    code: 'OFFICE',
    metaDescription: 'NevTan Office brings documents, spreadsheets, presentations and PDFs into one free desktop suite that saves real Word, Excel and PowerPoint files.',
    headline: 'Every document you write. One suite.',
    lead: 'NevTan Office brings documents, spreadsheets, presentations and PDFs into one suite, with your files always saved in real Word, Excel and PowerPoint formats.',
    highlights: ['Real .docx, .xlsx and .pptx', 'Files stay on your device', 'macOS and Windows'],
    primaryCta: 'Download NevTan Office free',
    demo: {
      title: 'Recent files',
      sidebar: ['Home', 'Docs', 'Sheets', 'Slides', 'PDF'],
      rows: [
        { a: 'Q3-Report.docx', b: 'Docs · on your device', tag: 'Saved', tone: 'success' },
        { a: 'Revenue.xlsx', b: 'Sheets · charts and pivot tables' },
        { a: 'Board-update.pptx', b: 'Slides · masters and layouts' },
        { a: 'Contract.pdf', b: 'PDF · annotated and filled' },
      ],
      toast: 'Saved to Q3-Report.docx · on your device',
    },
    features: {
      title: 'Everything you need to get work done',
      lead: 'Four apps, one suite, built around real file formats.',
      items: [
        { title: 'Docs', text: 'Word-compatible documents you can open, edit and save as .docx.' },
        { title: 'Sheets', text: 'Excel-compatible spreadsheets with charts, pivot tables and slicers.' },
        { title: 'Slides', text: 'PowerPoint-compatible presentations with masters, layouts and smart guides.' },
        { title: 'PDF', text: 'Read, annotate and fill PDF files with a full set of built-in tools.' },
        { title: 'Real file compatibility', text: 'Opens and saves .docx, .xlsx and .pptx directly, with no lossy conversion.' },
        { title: 'Cross-platform', text: 'Available on macOS and Windows, with the same experience everywhere.' },
      ],
    },
    spotlights: [
      {
        id: 'formats',
        eyebrow: 'Real file formats',
        title: 'No conversion, no lock-in',
        text: 'Your files are saved as real Word, Excel and PowerPoint files from the start.',
        points: ['Opens .docx, .xlsx and .pptx directly', 'Saves back to the same formats', 'No lossy conversion', 'No format lock-in'],
        image: null,
      },
      {
        id: 'local',
        eyebrow: 'Local-first',
        title: 'Your documents live on your device',
        text: 'Nothing is forced through the cloud. Your files stay where you keep them.',
        points: ['Files stay on your device by default', 'Nothing forced through the cloud', 'The same experience on macOS and Windows', 'One suite for docs, sheets, slides and PDF'],
        image: null,
      },
    ],
    worksWith: [],
    security: null,
    faq: [
      { q: 'Is NevTan Office free?', a: 'Yes. NevTan Office is free to use.' },
      { q: 'Which computers does it run on?', a: 'macOS and Windows.' },
      { q: 'Where are my files saved?', a: 'On your own device by default. Nothing is forced through the cloud.' },
      { q: 'Can I open Word, Excel and PowerPoint files?', a: 'Yes. Office opens and saves .docx, .xlsx and .pptx directly, without lossy conversion.' },
    ],
  },
};

export const PRODUCT_SLUGS = Object.keys(PRODUCTS);

export function productBySlug(slug) {
  const product = PRODUCTS[slug];
  if (!product) return null;
  return { slug, ...product, app: appByCode(product.code) };
}
