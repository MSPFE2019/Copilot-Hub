# Copilot Hub — SharePoint Site Template

> A SharePoint communication-site template for organizations rolling out **Copilot Chat**, **Microsoft Copilot** (formerly Microsoft 365 Copilot), the **Researcher** and **Analyst** agents, **agents in Copilot**, **Microsoft Copilot Studio**, **Microsoft Foundry** (formerly Azure AI Foundry), and **GitHub Copilot**. It started from the [Power Platform adoption hub template](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/sharepoint-site-template) and has been rewritten for the Copilot product family.

[![PnP PowerShell](https://img.shields.io/badge/PnP.PowerShell-1.12.x-0078D4?logo=powershell&logoColor=white)](https://pnp.github.io/powershell/)
[![SharePoint Online](https://img.shields.io/badge/SharePoint-Online-038387?logo=microsoftsharepoint&logoColor=white)](https://learn.microsoft.com/en-us/sharepoint/)
[![Version](https://img.shields.io/badge/version-5.1.0-7719AA)](#whats-new-in-510)

> **Distribution note:** The supported release artifact is `CopilotHub-v5.1.zip`, attached to the v5.1.0 release. Extract it and run the scripts from the extracted `CopilotHub` folder. This README alone is not a deployable copy of the template.

**Two design principles:**

1. **Interactive authentication** — deployment uses a tenant-owned, single-tenant public-client Entra app and delegated permissions. No certificates or stored secrets are required.
2. **Config-driven** — every tenant-specific value (company name, site URL, owner, app ID, and your organization's support, license, community, office-hours, and AI-policy links) lives in `Config.psd1`. You do not edit the provisioning XML for routine deployment.

> **Security warning:** This workflow requires the delegated SharePoint `AllSites.FullControl` permission. Although it is not an application permission and is limited by the signed-in user's access, it is still a high-privilege permission that can affect all SharePoint sites accessible to that administrator during the session. Use a dedicated administrative identity, review admin-consent policy, run the deployment from a managed workstation, and remove or disable the app registration when it is no longer needed.

> **Why an Entra app at all?** As of September 2024, Microsoft retired the shared "PnP Management Shell" multi-tenant app. PnP PowerShell now requires each tenant to register its own app — even for interactive sign-in. The registration is one-time and uses delegated permissions only.

---

## Table of contents

- [What's new in 5.1.0](#whats-new-in-510)
- [Package contents and integrity](#package-contents-and-integrity)
- [Site structure](#site-structure)
- [Training tracks](#training-tracks)
- [Localization](#localization)
- [Prerequisites](#prerequisites)
- [Configure](#configure)
- [Deploy](#deploy)
- [How it works](#how-it-works)
- [Customizing the template](#customizing-the-template)
- [Updating an existing deployment](#updating-an-existing-deployment)
- [Release check](#release-check)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [References](#references)
- [License](#license)

---

## What's new in 5.1.0

**New and rewritten content**

- **New product pages** for Copilot Chat, Microsoft Copilot, Researcher, Analyst, Agents (Agent Builder and Agent Store), Copilot Studio, and Microsoft Foundry. The GitHub Copilot page was rewritten and added to the menu (in 5.0.0 nothing linked to it).
- **"Which Copilot should I use?"** — a comparison page with a quick "I want to…" guide, a side-by-side table (best for, who it's for, works with, where you use it, what you need), and guidance on choosing between Agent Builder, Copilot Studio, and Microsoft Foundry.
- **Prompt library** and **Agent catalog** pages. The deploy script embeds the *Approved prompts* and *Approved agents* list views on them, and seeds 12 reviewed starter prompts.
- **Governance pages rewritten.** "Copilot at {CompanyName}", "Data protection for Copilot and agents", "Agent lifecycle and approval", and "Where agents are built" replace text carried over from the Power Platform template (environments, flows, Dataverse, connector-only DLP) with accurate Copilot guidance: permissions, sensitivity labels, Purview DLP for Microsoft 365 Copilot and Copilot Chat, SharePoint Advanced Management, agent approval in the Microsoft 365 admin center, and Copilot Studio data policies.
- **Every other page refreshed** — Get started, Request a Copilot license, Consultations, Internal communities, Support, Office hours, Hackathons, Success stories, Champion of the week, and the four page templates. No placeholders (`<LINK>`, `<COMPANY …>`), lorem ipsum, Yammer references, or Power Platform text remain.
- **Current product names.** Microsoft 365 Copilot is now Microsoft Copilot, Microsoft 365 Copilot Chat is now Microsoft Copilot Chat, and Azure AI Foundry is now Microsoft Foundry. Pages use the new names and note the old ones; license names still use "Microsoft 365 Copilot".
- **Launch news.** Three news posts so the home page is not empty on day one.

**Structure and usability**

- **Navigation rebuilt around what people need:** Home · Get started · Copilot tools · Prompts & agents · Learn · Use AI responsibly · Community · Help. Two levels only, so it reads well as a cascading or a mega menu.
- **Organization links in `Config.psd1`** (`SupportUrl`, `LicenseRequestUrl`, `CommunityUrl`, `OfficeHoursUrl`, `AIPolicyUrl`) are used throughout the pages. Blank values fall back safely, and the deploy reports every fallback it used.
- **Role-based learning** — Everyone, Agent makers, Admins and IT, Developers, and Leaders and architects — using only current, verified courses. Renamed or off-topic links were replaced.
- **Lists** gain columns (Prompt, Works in, Description, Open link, Data it uses) and choices (Researcher, Analyst, Microsoft Foundry, GitHub Copilot; Developer, Leader). On re-run, new choices are added to existing columns.
- **Sample events** fall on weekdays in the month after deployment (the first Tuesday, second Thursday, third Wednesday, and fourth Tuesday–Wednesday), include descriptions and a location, and include an "Office Hours" event so the Office hours page is not empty.
- **Accessibility:** every banner image has alternative text.

**Fixes**

- **Security settings are now enforced.** The deploy script excludes the template's `WebSettings` and `SiteSettings` handlers (they fail on GCC), so the template's sharing, SharePoint Designer, and workflow values were never applied in any earlier release. Phase 4b now turns off member sharing, SharePoint Designer, and declarative workflows explicitly.
- **List webhook removed.** 5.0.0 re-introduced a Site Pages webhook (pointing at a push-notification endpoint with a token from the original export) that 4.0.0 had removed.
- **Lists are no longer added to the site menu.** Earlier releases created the four lists with `-OnQuickLaunch`, which appended raw list links to the navigation on first deployment.
- **Content feeds work.** 5.0.0 deleted the sample pages that fed Success stories, Champion of the week, and Hackathons, and the page templates were tagged so feeds could display them. Templates are now untagged, and each template tells authors which Page type to set.
- **Localization works.** `Apply-Localization.ps1` could not rename navigation (it called a cmdlet PnP.PowerShell 1.12 does not have, searched only the hub menu, and did not resolve `{parameter:CompanyName}`), and its intro-text step never found a text web part. Both are fixed, and the packs cover the new navigation, pages, and columns.
- **Other fixes:** the Environments page no longer shows raw `<p><span>` HTML; the Hackathon template's Register button no longer links to a deleted page; the "Hackthons" typo is fixed; `docs.microsoft.com` and Power Platform-only links are gone; and the deploy script finds PnP.PowerShell in a OneDrive-redirected Documents folder in any organization (it only checked `OneDrive - Microsoft`).
- **New release check.** `Test-CopilotHubPackage.ps1` catches all of the above. See [Release check](#release-check).

---

## Package contents and integrity

After extracting `CopilotHub-v5.1.zip`, the package contains:

```text
CopilotHub/
├── Config.psd1                  # ← edit this once
├── Register-PnPApp.ps1          # One-time: registers an Entra app for PnP sign-in
├── Deploy-CopilotHub.ps1        # Deploys or updates the site (idempotent)
├── Seed-LearningPaths.ps1       # Seeds 21 learning resources (called by Deploy)
├── Seed-PromptLibrary.ps1       # Seeds 12 starter prompts (called by Deploy)
├── Apply-Localization.ps1       # Optional: es-ES / fr-FR / de-DE labels
├── Test-CopilotHubPackage.ps1   # Offline release check
├── template.pnp                 # 34 pages, navigation, Events list, 27 image files
├── VERSION.txt                  # 5.1.0
├── localization/                # Optional content packs (see Localization)
│   ├── README.md
│   ├── es-ES/content.json
│   ├── fr-FR/content.json
│   └── de-DE/content.json
├── assets/                      # Branded PNGs uploaded to /SiteAssets/CopilotHub/
├── Guided-Learning-Content.md   # Reference catalogue of courses (not deployed)
├── README.github.md
├── ReadMe.md
└── LICENSE
```

Before extracting or running administrative scripts, calculate the archive hash and compare it with the SHA-256 value published with the release:

```powershell
Get-FileHash .\CopilotHub-v5.1.zip -Algorithm SHA256
```

For `CopilotHub-v5.1.zip` (v5.1.0), the SHA-256 value is:

```text
7144C1227ED78C455CA865F9A541E7205BD8562E5DFA09C311065302FF93170A
```

Then run the offline release check from the extracted folder. It never connects to SharePoint:

```powershell
.\Test-CopilotHubPackage.ps1
```

Only use a release or commit from the supported repository history. Do not substitute an archive copied from an untrusted location.

---

## Site structure

**Type:** Communication site (`SITEPAGEPUBLISHING#0`)
**Default URL:** `/sites/copilothub`

### Navigation

```text
Home
├── Get started
│   ├── Start here
│   ├── Which Copilot should I use?
│   └── Request a Copilot license
├── Copilot tools
│   ├── Compare all tools
│   ├── Copilot Chat
│   ├── Microsoft Copilot
│   ├── Researcher
│   ├── Analyst
│   ├── Agents
│   ├── Copilot Studio
│   ├── Microsoft Foundry
│   └── GitHub Copilot
├── Prompts & agents
│   ├── Prompt library
│   └── Agent catalog
├── Learn
│   ├── Guided learning
│   ├── Office hours
│   ├── Consultations
│   └── Hackathons
├── Use AI responsibly
│   ├── Copilot at {CompanyName}
│   ├── Data protection
│   ├── Agent lifecycle & approval
│   └── Where agents are built
├── Community
│   ├── Success stories
│   ├── Champion of the week
│   └── Internal communities
└── Help
    ├── Help & learning
    └── Support
```

Every top-level item except Home is a label that opens its menu.

### Pages (34)

| Area | Pages |
| --- | --- |
| Home and news | Home, plus three launch news posts: *Introducing the Copilot Hub*, *Meet Researcher and Analyst*, *New guide: which Copilot should I use?* |
| Get started | Get started, Which Copilot should I use?, Request a Copilot license |
| Copilot tools | Copilot Chat, Microsoft Copilot, Researcher, Analyst, Agents, Copilot Studio, Microsoft Foundry, GitHub Copilot |
| Prompts & agents | Prompt library, Agent catalog |
| Learn | Guided learning, {CompanyName} office hours, Consultations, Hackathons |
| Use AI responsibly | Copilot at {CompanyName}, Data protection for Copilot and agents, Agent lifecycle and approval, Where agents are built |
| Community | Success stories, Champion of the week, Internal communities |
| Help | Help and learning, Support |
| Page templates | News, Story, Champion, Hackathon (in `SitePages/Templates`) |

Each product page covers what the tool is, what to use it for, what it works with, where to find it, who can use it, and what to know about safety and governance, with links to the official documentation. Product details were checked against Microsoft and GitHub documentation in September 2026. Names, features, and licensing change often, so plan to review these pages regularly.

### Page templates and feeds

The home page news carousel shows news posts with Page type **News**. The Success stories, Champion of the week, and Hackathons pages show pages with Page type **Story**, **Champion**, and **Hackathon**. Each page template starts with an author note that says which Page type to set in *Page details* before publishing. The templates themselves are tagged **Page**, so they never appear in a feed.

### Lists (4 native + 1 from template)

| List | Purpose | Columns | Starter content |
| --- | --- | --- | --- |
| **Learning Paths** | Courses by product and audience | Product, Audience, Requirement, Duration, Level, Learn URL, Owner | 21 courses |
| **Prompt Library** | Reviewed prompts shown on the Prompt library page | Prompt, Description, Product, Works in, Audience, Owner, Approval State | 12 starter prompts |
| **Agent Catalog** | Approved agents shown on the Agent catalog page | Description, Product, Audience, Open link, Data it uses, Owner, Approval State | — |
| **Approved Connectors** | Connectors approved for Copilot Studio agents | Connector, Description, Approval State, Owner | — |
| **Events** | Office hours, training, and community events | Provisioned by `template.pnp` | 4 sample events next month |

Views: *By Audience* (default), *By Product*, and *Required Only* on Learning Paths; *Approved prompts* on Prompt Library; *Approved agents* on Agent Catalog. Only items with Approval State **Approved** appear on the Prompt library and Agent catalog pages.

By default, visitors can read these lists and suggestions go to the adoption team through `SupportUrl`. To let employees submit prompts or agents directly, give them Contribute permission on the list and use Approval State to review submissions.

### Site columns (14)

`CopilotProduct`, `CopilotAudience`, `CopilotRequirement`, `CopilotDurationMinutes`, `CopilotLevel`, `CopilotLearnUrl`, `CopilotOwner`, `CopilotConnector`, `CopilotApprovalState`, `CopilotPromptText`, `CopilotApp`, `CopilotDescription`, `CopilotAgentUrl`, `CopilotDataSources` — all grouped under **Copilot Hub** in the site column gallery.

---

## Training tracks

The **Guided learning** page groups current, free courses by role. Every link was checked in September 2026.

- **Everyone:** Build foundational generative AI skills · Work smarter with AI · Draft and refine business content using Microsoft Copilot · Analyze and visualize data using Microsoft Copilot · Uncover new data insights with AI · Build agents in Copilot Chat (online workshop)
- **Agent makers:** Transform everyday business processes with agents (MS-4019) · Get started with Microsoft Copilot Studio · Create agents in Microsoft Copilot Studio · Extend Microsoft Copilot in Copilot Studio · Automate tasks and workflows in Copilot Studio · Applied Skills: Build an agent in Copilot Studio
- **Admins and IT:** Copilot adoption and onboarding guide for IT admins · Explore Microsoft 365 Copilot and agent administration · Protect information in a Microsoft 365 Copilot environment · Secure and govern Microsoft 365 Copilot interactions · Study guide for Exam AB-900
- **Developers:** Getting started with GitHub Copilot (GitHub Skills) · Get started with AI-assisted development · Develop generative AI apps on Microsoft Foundry · Get started with generative AI and agents in Azure · Applied Skills: Develop agents in Microsoft Foundry
- **Leaders and architects:** Empower your workforce with Microsoft Copilot · Architect AI solutions for business productivity · Analyze requirements for AI-powered business solutions · Design and build integrated AI agent solutions in Copilot Studio (AB-620) · Maximize the cost efficiency of AI agents on Azure · Microsoft Scenario Library

The **Learning Paths** list holds 21 of these courses with product, audience, and level metadata, and the Guided learning page links to it.

---

## Localization

The site deploys in English by default. Optional content packs for **Spanish (`es-ES`)**, **French (`fr-FR`)**, and **German (`de-DE`)** under `localization/` translate the navigation, all 27 page titles, the 14 site-column names, the five list titles, and the introductory text on Home, Get started, and GitHub Copilot. Product names are left untranslated.

Apply a pack inline:

```powershell
.\Deploy-CopilotHub.ps1 -Locale fr-FR
```

or against an already-deployed site:

```powershell
.\Apply-Localization.ps1 -Locale es-ES
```

The English base template is always provisioned first; localization only renames existing objects and never deletes or recreates content. It resolves `{parameter:CompanyName}` and `{site}` from `Config.psd1`, walks both the site and hub navigation, and reports any pack key that has no matching site object. See `localization/README.md` for the pack format and known limitations.

---

## Prerequisites

### PowerShell

Deployment requires **PnP.PowerShell 1.12.x** on **PowerShell 7.2 or later**. The template was built with PnP.Framework 1.10, and `Deploy-CopilotHub.ps1` explicitly loads 1.12.x even if newer versions are installed.

```powershell
Install-Module PnP.PowerShell -RequiredVersion 1.12.0 -Scope CurrentUser
```

Option A of the one-time app registration (below) uses `Register-PnPEntraIDAppForInteractiveLogin`, which is only in PnP.PowerShell 2.x and later. You can install a newer version side by side (`Install-Module PnP.PowerShell -Scope CurrentUser -Force`), or use Option B in the Entra portal instead.

### People

| Role | What they do | When |
| --- | --- | --- |
| **Global Administrator** | Registers the Entra app (`Register-PnPApp.ps1` or the Entra portal) | One time, per tenant |
| **SharePoint Administrator** (or Global Admin) | Runs the deployment interactively | Each deploy run |
| **Site owner** | The UPN listed in `Config.psd1` as `Owner` | At site creation |

You do **not** generate certificates or store secrets. The Entra app uses delegated permissions only, but `AllSites.FullControl` is high privilege: authorization at deploy time comes from your SharePoint Admin role and can affect every SharePoint site that account can access during the session.

---

## Configure

Open `Config.psd1` and fill in your tenant values. Leave `ClientId` empty for now; you'll fill it in after the one-time app registration.

```powershell
@{
    TenantUrl         = "https://contoso.sharepoint.com"
    SiteUrl           = "https://contoso.sharepoint.com/sites/copilothub"
    SiteTitle         = "Copilot Hub"
    CompanyName       = "Contoso"
    Owner             = "admin@contoso.onmicrosoft.com"
    Tenant            = "contoso.onmicrosoft.com"
    ClientId          = ""                          # filled in by step 1 below
    RegisterAsHub     = $true

    # Organization links (optional, recommended)
    SupportUrl        = "https://contoso.service-now.com/copilot"
    LicenseRequestUrl = "https://contoso.sharepoint.com/sites/it/SitePages/Request-software.aspx"
    CommunityUrl      = "https://engage.cloud.microsoft/main/groups/..."
    OfficeHoursUrl    = "https://teams.microsoft.com/l/meetup-join/..."
    AIPolicyUrl       = "https://contoso.sharepoint.com/sites/policies/AI-acceptable-use.pdf"
}
```

| Key | Required | Used for |
| --- | --- | --- |
| `TenantUrl`, `SiteUrl`, `SiteTitle`, `Owner`, `Tenant`, `ClientId` | Yes | Site creation and sign-in |
| `CompanyName` | Yes | Replaces `{parameter:CompanyName}` in page titles, text, and navigation |
| `RegisterAsHub` | Yes | Registers the site as a SharePoint hub |
| `SupportUrl` | Recommended | "Contact support", "Report it", and suggestion links. Blank → `mailto:` the `Owner` |
| `LicenseRequestUrl` | Recommended | License and seat requests. Blank → `SupportUrl` |
| `CommunityUrl` | Recommended | Community links (for example a Viva Engage community). Blank → `SupportUrl` |
| `OfficeHoursUrl` | Recommended | Office hours join and recordings link. Blank → `SupportUrl` |
| `AIPolicyUrl` | Recommended | Your AI or acceptable-use policy. Blank → `SupportUrl` |

Links must start with `https://` or `mailto:`. The deploy script lists every link that used a fallback, at the start and at the end of the run. All scripts read this one file; there are no other tenant-specific values in the package, and the XML template is never edited for routine deployment.

---

## Deploy

### Step 0 — Extract and preflight the package

Run the following from the directory containing `CopilotHub-v5.1.zip`:

```powershell
Expand-Archive .\CopilotHub-v5.1.zip -DestinationPath . -Force
Set-Location .\CopilotHub
Get-ChildItem .\Config.psd1, .\Register-PnPApp.ps1, .\Deploy-CopilotHub.ps1, .\Seed-LearningPaths.ps1, .\Seed-PromptLibrary.ps1, .\template.pnp
.\Test-CopilotHubPackage.ps1
```

The `Get-ChildItem` command must list every required file, and the release check must report that all checks passed. Stop and obtain a complete, trusted package if either fails.

### Step 1 — One-time: register the Entra app

You have two options. Pick whichever works on your machine.

**Option A — Script (PowerShell 7.2+ with PnP.PowerShell 2.x or later):**

```powershell
.\Register-PnPApp.ps1 -Tenant contoso.onmicrosoft.com
```

A browser opens. Sign in as a Global Administrator. The script calls `Register-PnPEntraIDAppForInteractiveLogin` and prints the `ClientId`.

> If you see `The term 'Register-PnPEntraIDAppForInteractiveLogin' is not recognized`, the loaded PnP.PowerShell is 1.x. The script detects this and prints Option B for you.

**Option B — Entra portal (any PowerShell version):**

1. Open [https://entra.microsoft.com](https://entra.microsoft.com) and sign in as **Global Administrator**.
2. **Identity → Applications → App registrations → New registration**:
   - Name: `PnP-CopilotHub-Deploy`
   - Account types: *Accounts in this organizational directory only (single tenant)*
   - Redirect URI: **Public client/native (mobile & desktop)** → `http://localhost`
   - Click **Register**.
3. On the **Overview** page, copy the **Application (client) ID**.
4. **API permissions → Add a permission**:
   - **SharePoint → Delegated → `AllSites.FullControl`**
   - **Microsoft Graph → Delegated → `User.Read`**
   - Remove the default `User.Read` if it was auto-added twice.
   - Click **Grant admin consent for *(tenant)***.
5. **Authentication → Advanced settings → "Allow public client flows"** → **Yes** → Save.

> These permissions are **delegated**, meaning the app inherits the signed-in user's scope. Delegated `AllSites.FullControl` remains high privilege and requires careful admin-consent review. PnP PowerShell uses SharePoint REST endpoints (not Microsoft Graph) for site creation, template apply, and hub registration in this workflow, so the SharePoint permission is sufficient; Graph `User.Read` lets Entra resolve the signed-in user during sign-in.

**Then for either option:** paste the `ClientId` into `Config.psd1` → `ClientId`. Wait about a minute for Entra propagation.

### Step 2 — Deploy

```powershell
.\Deploy-CopilotHub.ps1
```

A browser window opens. **Sign in as a SharePoint Administrator** (or Global Admin). Your role authorizes the deployment for the duration of the session — nothing is granted permanently.

The script is idempotent. Re-run it to push template changes; existing list data and site owners are preserved. It never permanently removes a deleted or errored site automatically. After explicit administrator approval, use `.\Deploy-CopilotHub.ps1 -PurgeConflictingSite`.

### Step 3 — Before you announce the site

1. Fill in the five organization links in `Config.psd1` and re-run the deploy.
2. Update or delete the four sample events, and add real Teams links.
3. Review the starter prompts, the three launch news posts, and the responsibilities on **Copilot at {CompanyName}** against your AI policy.
4. Confirm which Copilot tools and licenses your organization offers, and adjust the product pages and **Which Copilot should I use?** if something doesn't apply to you (for example GitHub Copilot or Microsoft Foundry).
5. Add your approved agents and connectors to the Agent Catalog and Approved Connectors lists.
6. Brief authors: set the Page type (News, Story, Champion, or Hackathon) in *Page details* when publishing, so posts appear in the right feed.

---

## How it works

`Deploy-CopilotHub.ps1` runs a **hybrid deployment**: `Invoke-PnPSiteTemplate` for rich modern pages (News, Events, Quick links, Highlighted content, and full navigation), and native PnP cmdlets for structured data, which report a clear error per step.

| # | Phase | How | What it does |
| --- | --- | --- | --- |
| 0 | Configuration | script | Loads `Config.psd1`, validates required values, and resolves the organization links with fallbacks |
| 1 | Module check | cmdlet | Loads PnP.PowerShell 1.12.x |
| 2 | Connect to the admin endpoint | cmdlet | Interactive sign-in as SharePoint Admin; creates the communication site if missing |
| 2b | Hub registration | cmdlet | Only if `RegisterAsHub = $true` |
| 2c | Site owners | cmdlet | On a new site, adds the deploying user as a site owner so the template can apply |
| 3 | Connect to the site | cmdlet | Pre-creates `SitePages/Templates` and `SiteAssets/Images` |
| 4 | Apply the template | `Invoke-PnPSiteTemplate` | 34 pages, navigation, Events list, images. The SiteHeader, SiteFooter, WebSettings, PropertyBagEntries, SiteSettings, Theme, and ComposedLook handlers are excluded because they fail on GCC |
| 4b | Hardening | cmdlet / CSOM | Turns off member sharing, SharePoint Designer, and declarative workflows (the template's settings handlers are excluded in phase 4) |
| 5 | Site columns | cmdlet | 14 columns; adds new choices to existing columns |
| 6 | Lists | cmdlet | Four lists, their columns, and default view columns |
| 7 | Views | cmdlet | Learning Paths views, *Approved prompts*, *Approved agents* |
| 8 | Branded assets | cmdlet | Uploads `assets/*.png` to `/SiteAssets/CopilotHub/` and sets the site logo |
| 9 | Seed content | script | 21 Learning Paths courses and 12 starter prompts (idempotent on Title) |
| 9b | Embed list views | cmdlet | Adds the approved views to the Prompt library and Agent catalog pages, then publishes them |
| 10 | Localization (optional) | script | Only if `-Locale` is supplied |

Every phase is idempotent and safe to re-run. Template data rows use overwrite behavior, and each run moves the sample events to the following month, so delete the sample events once you have real ones.

---

## Customizing the template

### Branding and copy

Pages and navigation live inside `template.pnp`, a standard zip archive:

1. Copy `template.pnp` to `template.zip` and extract it.
2. Edit `Files/CopilotHub.xml` (`ProvisioningTemplate/files-map.xml` maps it to `template.xml`).
3. Re-zip with the same internal structure, rename back to `template.pnp`, and run `.\Test-CopilotHubPackage.ps1` before deploying.

For most branding changes you don't need to touch the template:

| What | Where |
| --- | --- |
| Company name | `Config.psd1` → `CompanyName` |
| Support, license, community, office-hours, and AI-policy links | `Config.psd1` organization links |
| Site logo | Replace `assets/site-logo.png` and re-run Deploy |
| Hero banner image | Replace `assets/welcome-banner.png` and re-run Deploy |

### Swap in official brand assets

The `assets/` folder ships with self-generated PNGs. They are self-contained, with no external CDN dependencies, so the site renders on tenants with restrictive egress policy (for example GCC). Drop new PNGs with the same names into `assets/` and re-run `Deploy-CopilotHub.ps1`. The 27 banner and section images are bundled inside `template.pnp` and uploaded to `/SiteAssets/Images/` automatically.

### Add internal training, prompts, or agents

- **Training:** append to `$courses` in `Seed-LearningPaths.ps1` (Product, Audience, Requirement, and Level must match the column choices) and re-run; existing titles are skipped.
- **Prompts:** append to `$prompts` in `Seed-PromptLibrary.ps1`, or add items to the Prompt Library list with Approval State **Approved**.
- **Agents and connectors:** add items to the Agent Catalog or Approved Connectors list with Approval State **Approved**.

---

## Updating an existing deployment

```powershell
# Push template changes (pages, columns, lists, nav, seed content)
.\Deploy-CopilotHub.ps1

# Refresh just the seeded lists
.\Seed-LearningPaths.ps1
.\Seed-PromptLibrary.ps1
```

**Upgrading from 5.0.0 or earlier:**

- Pages keep their names, so the rewritten pages overwrite the old ones, including the old "Accelerate your work with Microsoft 365 Copilot" page, which becomes the welcome news post. New pages are added and the navigation is replaced, which also removes the list links that earlier versions appended to the menu.
- Choice columns get the new choices, lists get the new columns, and starter prompts and new courses are added.
- Not removed automatically: the earlier Learning Paths rows *Transform ideas into action with Copilot Chat (Basic)* and *Get started with Microsoft 365 Copilot* (both now point to renamed courses), and the old sample events (*Company hackathon*, *Microsoft 365 Copilot showcase*, *12 days of Microsoft 365 Copilot*). Delete them by hand.
- If you use a locale pack, re-run `Apply-Localization.ps1` after the deploy.

---

## Release check

`Test-CopilotHubPackage.ps1` inspects a package folder or release zip offline and exits with code 1 if any check fails:

| Area | Checks |
| --- | --- |
| Package | Required files, `VERSION.txt`, PowerShell syntax |
| Security | Sharing, Designer, and workflow flags are off in the template **and** enforced by the deploy script; no list webhooks |
| Content | No double-encoded HTML, unfilled placeholders, lorem ipsum, or carried-over Power Platform text |
| Links | Every internal link and navigation link resolves to a page; no unreachable pages |
| Feeds | Page templates are not tagged for news or highlighted-content feeds |
| Accessibility | Every banner image has alternative text |
| Parameters | Every `{parameter:X}` token is supplied by the deploy script |
| Localization | Every pack parses, its keys match the template, and it covers every navigation label and column |
| Events | Category-filtered Events web parts have a matching sample event |

```powershell
.\Test-CopilotHubPackage.ps1 -Path ..\CopilotHub-v5.1.zip
```

Run it before every release; the repository's GitHub Actions workflow runs it on each push. For reference, the 5.0.0 release package fails 12 of the 20 checks that apply to it.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `PnP.PowerShell 1.12.x is required` | `Install-Module PnP.PowerShell -RequiredVersion 1.12.0 -Scope CurrentUser` |
| `Config.psd1 is missing required value: X` | Open `Config.psd1` and fill in the missing value |
| `Config.psd1 -> X must start with https:// or mailto:` | Fix the organization link, or leave it blank to use the fallback |
| Pages link to an email address instead of your support site | `SupportUrl` is blank, so links fall back to `mailto:` the owner. Fill it in and re-run Deploy |
| `template.pnp not found` | Extract the complete package and keep `template.pnp` next to `Deploy-CopilotHub.ps1` |
| `AADSTS700016: Application with identifier ... was not found` | The app registration hasn't been done yet, or `ClientId` is wrong or from a different tenant |
| `Register-PnPEntraIDAppForInteractiveLogin is not recognized` | PnP.PowerShell 1.x is loaded. Use **Option B** (Entra portal), or install PnP.PowerShell 2.x or later side by side |
| Sign-in works but `Connect-PnPOnline` returns `AccessDenied` | Wait about a minute after registration, then retry. Confirm admin consent for `AllSites.FullControl` and `User.Read`, and that the account is a SharePoint Administrator |
| `AADSTS65001: The user or administrator has not consented to use the application` | Entra portal → the app → API permissions → **Grant admin consent** |
| Browser prompt loops on sign-in | Make sure your account holds the **SharePoint Administrator** role |
| `Get-PnPTenantSite` returns 403 | You're not signed in as a SharePoint Admin. Re-run and sign in with the correct account |
| `New-PnPSite : {"RawSiteProvisionState":1,"SiteId":"","SiteStatus":3,"SiteUrl":""}` | A previous attempt left state behind, or the `Owner` UPN isn't valid. The script checks for deleted or errored sites and verifies the owner before retrying. Check **Active sites** and **Deleted sites** in the SharePoint admin center. Don't delete a site or data as a shortcut; get an approved cleanup plan first |
| "Owner UPN ... could not be resolved" | `Owner` is a placeholder or doesn't exist in your tenant. Set it to a real licensed UPN |
| `warn : could not turn off member sharing` | Turn it off manually: Site settings → Site permissions → Change how members can share |
| `warn : could not embed 'Approved prompts'` (or `'Approved agents'`) | Edit the page, add a **List** web part, choose the list and the *Approved prompts* / *Approved agents* view, then republish. The page already links to the list |
| `List 'Learning Paths' not found` / `List 'Prompt Library' not found` | Run `Deploy-CopilotHub.ps1` before the seed scripts |
| Pages show `{parameter:CompanyName}` literally | `CompanyName` is blank in `Config.psd1` |
| Office hours page shows no events | That page shows only events whose Category is **Office Hours** |
| A news post doesn't appear on Home | Publish it as a news post and set Page type to **News** in *Page details* |
| Site logo is missing | The asset upload (phase 8) failed. Confirm `assets/*.png` is next to the deploy script and re-run |
| Pages or sections are missing after deploy | `Invoke-PnPSiteTemplate` (phase 4) failed. Check the `CopilotHub-pnptrace-*.log` next to the script, and run `.\Test-CopilotHubPackage.ps1` to confirm the package is intact |
| Edits to page content aren't showing | Pages and navigation are owned by the template, and Deploy overwrites them. Edit the template (see [Customizing](#customizing-the-template)) or stop re-running Deploy after you customize pages in SharePoint |
| `Register-PnPHubSite` fails | Confirm `RegisterAsHub = $true` and that your account is a SharePoint Admin |

---

## Roadmap

- [ ] Power Automate flow: auto-assign required training when a Copilot license is requested
- [ ] Power BI report on training completion and Copilot usage
- [ ] Sample declarative agent definition and Copilot Studio solution
- [ ] Localized bodies for the product and governance pages

---

## References

- [PnP PowerShell docs](https://pnp.github.io/powershell/)
- [PnP provisioning schema](https://github.com/pnp/PnP-Provisioning-Schema)
- [Power Platform site template (origin model)](https://learn.microsoft.com/en-us/power-platform/guidance/adoption/sharepoint-site-template)
- [Microsoft Copilot adoption resources](https://adoption.microsoft.com/en-us/copilot/)
- [Microsoft Copilot adoption and onboarding guide for IT admins](https://learn.microsoft.com/en-us/microsoft-365/copilot/microsoft-365-copilot-enablement-resources)
- [Copilot controls overview](https://learn.microsoft.com/en-us/microsoft-365/copilot/copilot-controls/overview)
- [Microsoft Copilot hub on Learn](https://learn.microsoft.com/en-us/microsoft-365/copilot/)

---

## License

No `LICENSE` file is present at this repository root. Until a repository license is added, treat repository contents as all rights reserved and obtain permission before redistributing or modifying them. The extracted release package may contain its own license file; that does not automatically license the repository, local artifacts, or separately copied assets. Microsoft, Microsoft Copilot, Microsoft 365 Copilot, Copilot Studio, Microsoft Foundry, and SharePoint are trademarks of the Microsoft group of companies. GitHub and GitHub Copilot are trademarks of GitHub, Inc.
