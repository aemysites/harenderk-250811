/* global WebImporter */
export default function parse(element, { document }) {
  // Find the first tab bar
  const tabBar = element.querySelector('.common-tabs ul.nav.nav-tabs');
  if (!tabBar) return;
  const tabLinks = Array.from(tabBar.querySelectorAll('li > a'));
  if (!tabLinks.length) return;

  // Header row as in example: one column
  const cells = [['Tabs (tabs93)']];

  // For each tab, extract label and content
  tabLinks.forEach((link) => {
    const tabLabel = link.textContent.trim();
    let tabContent = '';

    // Attempt to find associated section/div for tab
    // Strategy: look for ids/classes containing or matching the link's id
    let candidates = Array.from(element.querySelectorAll('[id], [class]'));
    let tabSection = null;
    if (link.id) {
      tabSection = candidates.find((el) => {
        if (el.id && (el.id === link.id || el.id.startsWith(link.id))) return true;
        if (el.classList && Array.from(el.classList).some(cls => cls.includes(link.id))) return true;
        return false;
      });
    }
    // If not found and only one main section in this block, fallback to most relevant .account-views or .tab-content
    if (!tabSection) {
      tabSection = element.querySelector('.account-views') || element.querySelector('.tab-content');
    }
    // If still not found, fallback to nearest container after tabBar
    if (!tabSection) {
      let parent = tabBar.closest('div,section');
      let next = parent && parent.nextElementSibling;
      while(next && next.textContent.trim().length === 0) {
        next = next.nextElementSibling;
      }
      if (next) {
        tabSection = next;
      }
    }

    // If found, use section; else empty string
    if (tabSection) {
      tabContent = tabSection;
    }
    cells.push([tabLabel, tabContent]);
  });

  // Replace original element
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
