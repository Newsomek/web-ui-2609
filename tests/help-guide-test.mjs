import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

const index = fs.readFileSync(
  path.join(root, "index.html"),
  "utf8"
);

const help = fs.readFileSync(
  path.join(root, "assets", "help.html"),
  "utf8"
);

const tooltipJs = fs.readFileSync(
  path.join(root, "js", "nav-tooltips.js"),
  "utf8"
);

function requireMarker(source, marker, description) {
  if (!source.includes(marker)) {
    throw new Error(
      `PracticeSpend help-guide guard missing ${description}: ${marker}`
    );
  }
}

requireMarker(index, 'id="helpGuideBtn"', "Help navigation");
requireMarker(
  index,
  "Open a short guide explaining what PracticeSpend does",
  "Help navigation tooltip"
);

requireMarker(
  tooltipJs,
  'window.open(',
  "new-window behavior"
);

requireMarker(
  tooltipJs,
  '"assets/help.html"',
  "Help page target"
);

requireMarker(
  help,
  "How to explore PracticeSpend",
  "guide heading"
);

requireMarker(
  help,
  "<h2>Acting As</h2>",
  "Acting As section"
);

requireMarker(
  help,
  "different demonstration users",
  "Acting As persona explanation"
);

requireMarker(
  help,
  "permissions and actions",
  "Acting As permission explanation"
);

requireMarker(
  help,
  "production authentication or security",
  "Acting As demo-only clarification"
);

requireMarker(
  help,
  "Check who you are Acting As.",
  "Acting As tour step"
);
requireMarker(
  help,
  "A five-minute tour",
  "five-minute tour"
);

requireMarker(
  help,
  "Potential annualized opportunity",
  "opportunity explanation"
);

requireMarker(
  help,
  "Effective Unit Cost",
  "effective unit cost explanation"
);

requireMarker(
  help,
  "Human judgment",
  "review-governance explanation"
);

requireMarker(
  help,
  "Duplicates and reconciliation",
  "duplicate/reconciliation explanation"
);

requireMarker(
  help,
  "Modern Dermatology, PLLC",
  "restricted-demo identification"
);

requireMarker(
  help,
  "Kelly@Newsome.com?subject=PracticeSpend%20Inquiry",
  "contact link"
);

console.log("PracticeSpend compact help-guide guards passed.");

