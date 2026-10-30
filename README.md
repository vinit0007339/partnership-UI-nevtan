# NevTan Partner UI

The NevTan Partner Program site: what the program offers, how it works, the FAQ, the application
form, and — once a partner is approved — the partner dashboard and the NevTan team's admin.
Next.js 15 (pages router) with MUI 5.

Partners refer clients to NevTan Workspace with a personal link. NevTan bills the client, and the
partner earns commission on what the client pays. The commission rate and payout terms are agreed
with each partner when they're approved, so the public site never states a rate; an approved partner
sees their own in the dashboard. The program copy lives in `src/constant/program.js`.

The backend is [partnership-api-nevtan](../partnership-api-nevtan).

## Run locally

```bash
npm install
npm run dev          # http://localhost:3010, talks to the API on http://localhost:8091
```

Start the API first. It only accepts browser requests from the origins it lists, so keep the UI on
port 3010.

Sign-in goes through NevTan SSO from the browser. On localhost the SSO session cookie isn't sent,
so you always see the email and password form; on `*.nevtan.com` someone already signed in to
another NevTan app is signed straight in.

Don't run `npm run build:*` while `npm run dev` is running: both write to `.next/` and the dev
server breaks until it is restarted.

## Build profiles

Each profile reads its own `.env.<profile>` file:

| Command | Profile | API | Site URL |
| --- | --- | --- | --- |
| `npm run dev` / `build:localhost` | `localhost` | `http://localhost:8091` | `http://localhost:3010` |
| `npm run dev:stage` / `build:stage` | `stage` | `https://stage-partner-api.nevtan.com` | `https://stage-partner.nevtan.com` |
| `npm run build:prod` | `prod` | `https://partner-api.nevtan.com` | `https://partner.nevtan.com` |

Only the `prod` profile lets search engines crawl the site, and even then never the signed-in
pages (see `src/pages/robots.txt.jsx`).

Set `NEXT_PUBLIC_GTM_ID` and `NEXT_PUBLIC_META_PIXEL_ID` in the env file to turn on Google Tag
Manager and the Meta Pixel. Both stay off while empty.

## Pages

| Route | Who | What |
| --- | --- | --- |
| `/`, `/pricing`, `/products`, `/products/[slug]`, `/how-it-works`, `/faq` | Everyone | The program, what partners earn on each plan, the apps |
| `/apply` | Everyone | The application form (`POST api/public/partner-applications`) |
| `/login`, `/reset-password` | Everyone | NevTan SSO sign-in, account creation and password reset |
| `/auth/callback` | Everyone | Where NevTan SSO returns people (the `nevtan-partner` client's login URL), e.g. after verifying a new account |
| `/dashboard` | Approved partners | Referral link, clients, earnings by month, payouts |
| `/admin` | NevTan team (SSO `ROLE_SUPERADMIN`) | Approve or reject applications, suspend partners, record payouts |

The API decides who gets in: `POST api/auth/sso/exchange` only issues a session to approved partners
and NevTan admins, and answers everyone else with a message the sign-in page shows as-is (for
example, that the application is still under review).

## Deploy

### Docker

```bash
docker build --build-arg APP_ENV=prod -t nevtan-partner-ui .     # or APP_ENV=stage
docker run -p 3000:3000 nevtan-partner-ui
```

`APP_ENV` picks which `.env.<profile>` file is compiled in. `NEXT_PUBLIC_*` values are baked in
at build time, so setting them on the running container does nothing. To change one without
editing the file, pass it as a build arg, which wins over the file:

```bash
docker build --build-arg APP_ENV=stage \
  --build-arg NEXT_PUBLIC_API_BASE_URL=https://stage-partner-api.nevtan.com \
  -t nevtan-partner-ui .
```

The image runs Next's standalone server (`node server.js`) on port 3000 as a non-root user.
Because of `output: "standalone"`, `npm start` prints a warning locally. It still works.

### Amplify

`amplify.yml` builds `prod` for the `main`/`prod`/`production` branches and `stage` for everything
else, the same as the other NevTan UIs.

## Layout

```
src/
  pages/        Next.js routes (see above), plus 404, robots.txt, sitemap.xml
  screens/      One component per page
  component/    Layout, header/footer, plan cards, earnings calculator, application form,
                ConsoleParts (tables, panels, status chips for the dashboard and admin),
                admin/ (the admin tabs), WhatsApp chat widget
  constant/     program.js — the partner terms (commission, payouts) and all program copy
                products.js — the NevTan apps; productPages.js — product page copy (from Workspace)
                Environment.js — URLs and API paths per profile; support.js — WhatsApp number
  Utility/      auth.js — the partner session; sso.js — NevTan SSO calls; useRequireAuth.js —
                guards signed-in pages; axiosInstances.js — public and signed-in API clients;
                workspacePricing.js — live NevTan Workspace prices; formatting, Meta Pixel
```

Every list price comes live from the NevTan Workspace pricing API. Pages load it on the server
(refreshed hourly), then the visitor's browser asks again to show the visitor's own currency. That
second request only works once the Workspace API allows this site: add
`https://partner.nevtan.com,https://stage-partner.nevtan.com` to `WORKSPACE_PUBLIC_CORS_ORIGINS` on
the Workspace API server. Until then visitors see the server's currency, and the browser console
shows a CORS error for that request.

## What NevTan SSO needs

The `nevtan-partner` client must be registered in NevTan SSO (`DataInitializer`), or SSO answers
`Unknown client` to the session check and sign-up can't build its verification link.
