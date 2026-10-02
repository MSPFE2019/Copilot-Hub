const coworkDocs = {
  overview: "https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/",
  access: "https://learn.microsoft.com/en-us/microsoft-365/copilot/cowork/cowork-admin-governance",
  credits: "https://learn.microsoft.com/en-us/microsoft-365/copilot/usage-based-billing-overview-copilot-credits",
  studioBilling: "https://learn.microsoft.com/en-us/microsoft-copilot-studio/billing-licensing",
  sharePointStart: "https://learn.microsoft.com/en-us/sharepoint/get-started-sharepoint-agents",
  sharePointAccess: "https://learn.microsoft.com/en-us/sharepoint/manage-access-agents-in-sharepoint",
  sharePointPayg: "https://learn.microsoft.com/en-us/microsoft-365/copilot/pay-as-you-go/overview",
};

document.querySelector(".mock-note").textContent =
  "Local preview of the Copilot Hub v5.2.0 experience, including Copilot Cowork and SharePoint agents. Sample events, starter prompts, launch news and Contoso links illustrate the package defaults; links to Contoso systems stand in for organization links set in Config.psd1. Colors are illustrative; a deployed site uses your organization's SharePoint theme.";

const previewNav = document.querySelector(".site-nav .nav-list");
const toolsMenu = [...previewNav.querySelectorAll(".has-menu")].find((item) =>
  item.querySelector('a[href="#/Microsoft-Copilot"]') &&
  item.querySelector('a[href="#/Agents"]')
);

function addNavigationEntry(afterRoute, route, title) {
  const current = toolsMenu.querySelector(`a[href="#/${afterRoute}"]`);
  if (!current) throw new Error(`Missing navigation item: ${afterRoute}`);

  const entry = document.createElement("li");
  const link = document.createElement("a");
  link.href = `#/${route}`;
  link.textContent = title;
  entry.appendChild(link);
  current.parentElement.insertAdjacentElement("afterend", entry);

  const topLink = toolsMenu.querySelector(".nav-top");
  topLink.dataset.routes = `${topLink.dataset.routes} ${route}`;
}

function addResourceCard(list, resource, example) {
  const card = example.cloneNode(true);
  const link = card.querySelector("a");
  link.href = resource.url;
  card.querySelector(".ql-label").textContent = resource.title;
  list.appendChild(card);
}

function setResources(page, resources, replace = false) {
  const list = page.querySelector(".wp-quicklinks ul");
  if (!list) throw new Error(`Missing quick links on ${page.dataset.route}`);

  const example = list.querySelector("li");
  if (!example) throw new Error(`Missing quick-link card template on ${page.dataset.route}`);
  if (replace) list.replaceChildren();
  resources.forEach((resource) => addResourceCard(list, resource, example));
}

function createProductPage(route, title, intro, body, resources) {
  const template = document.querySelector('.page[data-route="Microsoft-Copilot"]');
  const page = template.cloneNode(true);
  page.dataset.route = route;
  page.dataset.title = title;
  page.hidden = true;
  page.querySelector(".ph-copy h1").textContent = title;
  page.querySelector(".wp-text").innerHTML = intro;
  page.querySelectorAll(".wp-text")[1].innerHTML = body;
  setResources(page, resources, true);
  document.getElementById("canvas").appendChild(page);
  SEARCH_INDEX.push({ route, title, kind: "Copilot tools" });
}

function appendPageSection(pageRoute, heading, content) {
  const page = document.querySelector(`.page[data-route="${pageRoute}"]`);
  const text = page.querySelectorAll(".wp-text")[1];
  text.insertAdjacentHTML("beforeend", `<h3>${heading}</h3>${content}`);
  return page;
}

addNavigationEntry("Microsoft-Copilot", "Copilot-Cowork", "Copilot Cowork");
addNavigationEntry("Agents", "SharePoint-Agents", "SharePoint agents");

createProductPage(
  "Copilot-Cowork",
  "Copilot Cowork",
  "<p><strong>Copilot Cowork</strong> is an agentic system in Microsoft Copilot that can carry out multistep work across Microsoft 365. Unlike a custom agent in the Agent Store, it coordinates tasks for you and shows actions for review before they happen.</p>",
  `<h3>Use it for</h3><ul><li>Preparing a meeting across email, calendar and files</li><li>Drafting documents and coordinating follow-up steps</li><li>Working through a request that spans multiple apps or takes several steps</li></ul><h3>What it works with</h3><p>Your permitted Microsoft 365 content and supported tools. Review what Cowork plans to do before approving actions.</p><h3>Where to find it</h3><p>In the Microsoft Copilot app, if your organization has enabled Cowork for you.</p><h3>Who can use it</h3><p>For work accounts, access requires a Microsoft 365 Copilot license and an admin spending policy selecting Cowork. Usage consumes Copilot Credits. Availability depends on your tenant and cloud; check with your admin before recommending it to colleagues.</p><h3>Before you begin</h3><p>Use the right permissions and follow your organization's data-handling policies. Cowork is not a replacement for reviewing and approving what is sent or changed on your behalf.</p><h3>Learn more</h3><p>Read the Microsoft overview, then compare it with other experiences on <a href="#/Compare-Copilot-Tools">Which Copilot should I use?</a></p>`,
  [
    { title: "Copilot Cowork overview", url: coworkDocs.overview },
    { title: "Cowork access and governance", url: coworkDocs.access },
    { title: "Copilot Credits and cost management", url: coworkDocs.credits },
  ]
);

createProductPage(
  "SharePoint-Agents",
  "SharePoint agents",
  "<p><strong>SharePoint agents</strong> answer questions using content from a SharePoint site, its pages and document libraries. They respond using the information each person is permitted to access.</p>",
  `<h3>Use them for</h3><ul><li>Finding answers in a team's approved site content</li><li>Explaining policies or onboarding material stored in SharePoint</li><li>Helping colleagues navigate a document library or collection of pages</li></ul><h3>What they work with</h3><p>SharePoint sites, pages and documents that the person asking the question can access. Curate sources and confirm site permissions before sharing an agent.</p><h3>Where to find them</h3><p>On eligible SharePoint sites and in supported Copilot experiences. Start from the relevant site and follow your organization's agent-sharing policy.</p><h3>Who can use them</h3><p>Creating an agent requires a Copilot license and permission to add files to the site. Using one requires a Copilot license or enabled pay-as-you-go billing. Check tenant and cloud availability; SharePoint agents are distinct from Copilot in SharePoint.</p><h3>Before you share an agent</h3><p>Check the underlying content's permissions and follow <a href="#/Agent-Lifecycle-and-Approval">Agent lifecycle &amp; approval</a> for wider distribution.</p><h3>Learn more</h3><p>For the latest eligibility details, see <a href="${coworkDocs.sharePointStart}">Get started with agents in SharePoint</a>. Compare the tools on <a href="#/Compare-Copilot-Tools">Which Copilot should I use?</a></p>`,
  [
    { title: "Get started with agents in SharePoint", url: coworkDocs.sharePointStart },
    { title: "Manage access to SharePoint agents", url: coworkDocs.sharePointAccess },
    { title: "SharePoint agents pay-as-you-go", url: coworkDocs.sharePointPayg },
  ]
);

const microsoftCopilot = appendPageSection(
  "Microsoft-Copilot",
  "Copilot Cowork",
  '<p>For multistep work across Microsoft 365, see the dedicated <a href="#/Copilot-Cowork">Copilot Cowork</a> page.</p><p><a href="' +
    coworkDocs.access +
    '" target="_blank" rel="noopener noreferrer">Cowork access and billing</a></p>'
);
setResources(microsoftCopilot, [
  { title: "Cowork access and billing", url: coworkDocs.access },
]);

const agentsPage = appendPageSection(
  "Agents",
  "SharePoint agents",
  '<p>For answers grounded in a site and its documents, see the dedicated <a href="#/SharePoint-Agents">SharePoint agents</a> page.</p>'
);
setResources(agentsPage, [
  { title: "Get started with agents in SharePoint", url: coworkDocs.sharePointStart },
]);

const studioPage = document.querySelector('.page[data-route="Copilot-Studio"]');
const studioBody = studioPage.querySelectorAll(".wp-text")[1];
const whoCanUseHeading = [...studioBody.querySelectorAll("h3")].find((heading) =>
  heading.textContent === "Who can use it"
);
const whoCanUseCopy = whoCanUseHeading?.nextElementSibling;
if (!whoCanUseCopy) throw new Error("Could not find the Copilot Studio licensing section.");
whoCanUseCopy.insertAdjacentHTML(
  "afterend",
  '<p>Review current licensing and Copilot Credits: <a href="' +
    coworkDocs.studioBilling +
    '" target="_blank" rel="noopener noreferrer">Review current licensing</a> · <a href="' +
    coworkDocs.credits +
    '" target="_blank" rel="noopener noreferrer">Copilot Credits</a>.</p>'
);
setResources(studioPage, [
  { title: "Understand Copilot Credits", url: coworkDocs.credits },
]);

const comparison = document.querySelector('.page[data-route="Compare-Copilot-Tools"]');
const guide = [...comparison.querySelectorAll(".wp-text")].find((text) =>
  text.querySelector("h2")?.textContent.includes("Quick guide")
);
const guideList = guide?.querySelector("ul");
if (!guideList) throw new Error("Could not find the comparison quick guide.");

for (const [prompt, route, title] of [
  ["Have a multistep task carried out across Microsoft 365", "Copilot-Cowork", "Copilot Cowork"],
  ["Find answers from a SharePoint site or its documents", "SharePoint-Agents", "SharePoint agents"],
]) {
  const item = document.createElement("li");
  const label = document.createElement("strong");
  const link = document.createElement("a");
  label.textContent = prompt;
  link.href = `#/${route}`;
  link.textContent = title;
  item.append(label, ": ", link);
  guideList.appendChild(item);
}

const comparisonTable = [...comparison.querySelectorAll(".wp-text")].find((text) =>
  text.querySelector("h2")?.textContent === "Side by side"
)?.querySelector("table tbody");
if (!comparisonTable) throw new Error("Could not find the comparison table.");

const studioRow = [...comparisonTable.rows].find((row) =>
  row.cells[0]?.textContent.includes("Copilot Studio")
);
if (!studioRow) throw new Error("Could not find the Copilot Studio comparison row.");
studioRow.cells[5].insertAdjacentHTML(
  "beforeend",
  '<br><a href="' +
    coworkDocs.studioBilling +
    '" target="_blank" rel="noopener noreferrer">Copilot Studio licensing</a> · <a href="' +
    coworkDocs.credits +
    '" target="_blank" rel="noopener noreferrer">Copilot Credits</a>'
);

for (const rowData of [
  [
    "Copilot Cowork",
    "Completing multistep work across Microsoft 365 with actions reviewed by you",
    "Licensed employees with admin-enabled access",
    "Your permitted Microsoft 365 data and apps",
    "Cowork in the Microsoft Copilot app",
    "A Microsoft 365 Copilot license and a Cowork spending policy; usage consumes Copilot Credits.",
    "Check access and billing",
    coworkDocs.access,
    "Copilot-Cowork",
  ],
  [
    "SharePoint agents",
    "Answers grounded in a SharePoint site's pages and documents",
    "Site contributors create; permitted users interact",
    "SharePoint content you can access",
    "SharePoint and supported Copilot experiences",
    "A Copilot license to create; a Copilot license or enabled pay-as-you-go to use.",
    "See requirements",
    coworkDocs.sharePointStart,
    "SharePoint-Agents",
  ],
]) {
  const row = comparisonTable.insertRow();
  rowData.slice(0, 6).forEach((value, index) => {
    const cell = row.insertCell();
    if (index === 0) {
      const link = document.createElement("a");
      link.href = `#/${rowData[8]}`;
      link.textContent = value;
      cell.appendChild(link);
    } else {
      cell.textContent = value;
    }
  });
  const requirementLink = document.createElement("a");
  requirementLink.href = rowData[7];
  requirementLink.target = "_blank";
  requirementLink.rel = "noopener noreferrer";
  requirementLink.textContent = rowData[6];
  row.cells[5].append(" ", requirementLink);
}

function showV52Route() {
  const route = decodeURIComponent(location.hash.replace(/^#\/?/, "")) || "Home";
  const page = [...document.querySelectorAll(".page")].find((candidate) => candidate.dataset.route === route);
  if (!page) return;

  document.querySelectorAll(".page").forEach((candidate) => {
    candidate.hidden = candidate !== page;
  });
  document.title = `${page.dataset.title} - Copilot Hub`;
  document.querySelectorAll(".nav-top").forEach((button) => {
    button.classList.toggle("active", (button.dataset.routes || "").split(" ").includes(route));
  });
  document.querySelectorAll(".has-menu.open").forEach((item) => {
    item.classList.remove("open");
    item.querySelector(".nav-top")?.setAttribute("aria-expanded", "false");
  });
  document.getElementById("results").hidden = true;
  window.scrollTo(0, 0);
}

window.addEventListener("hashchange", showV52Route);
showV52Route();
