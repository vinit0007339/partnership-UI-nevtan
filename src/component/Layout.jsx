import React from "react";
import Head from "next/head";
import { Box } from "@mui/material";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import WhatsAppChatWidget from "./WhatsAppChatWidget";
import { endPoints } from "../constant/Environment";

const SITE_NAME = "NevTan Partner Program";
const DEFAULT_TITLE = "NevTan Partner Program — Earn Commission on Every Client You Refer | NevTan";
const OG_IMAGE = `${endPoints.siteUrl}/nevtan-logo.png`;

/**
 * Every page: SEO tags, the sticky header, the page itself and the footer. Signed-in pages pass
 * `noindex` so search engines never list them.
 */
const Layout = ({ title, description, path = "/", jsonLd, noindex = false, children }) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const url = `${endPoints.siteUrl}${path}`;

  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description} />
        {noindex ? <meta name="robots" content="noindex, nofollow" /> : <link rel="canonical" href={url} />}
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_NAME} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1137" />
        <meta property="og:image:height" content="419" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={OG_IMAGE} />
        {jsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />}
      </Head>

      <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
        <SiteHeader />
        <Box component="main" sx={{ flex: 1 }}>
          {children}
        </Box>
        <SiteFooter />
      </Box>
      <WhatsAppChatWidget />
    </>
  );
};

export default Layout;
