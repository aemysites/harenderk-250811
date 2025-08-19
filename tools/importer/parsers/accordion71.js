/* global WebImporter */
export default function parse(element, { document }) {
  // Header row as specified
  const headerRow = ['Accordion (accordion71)'];

  // Get all tab titles (left side, clickable)
  const tabsNav = element.querySelector('.investorrelationfinancetabs .nav-tabs');
  if (!tabsNav) return;
  const tabTitles = Array.from(tabsNav.querySelectorAll('a'));

  // Get all tab panes (right side, content)
  const tabContent = element.querySelector('.tab-content');
  if (!tabContent) return;
  const panes = Array.from(tabContent.querySelectorAll('.tab-pane'));

  // Compose rows: each row = [title, content]
  const rows = tabTitles.map((tabTitle, i) => {
    // Reference the anchor element directly (do not clone)
    // Create a span to hold the tab title as plain text to avoid anchor artifacts
    const titleSpan = document.createElement('span');
    titleSpan.innerHTML = tabTitle.textContent || '';

    // Reference the corresponding pane's content
    let paneContent = panes[i];
    // Defensive: if no pane exists, leave empty content
    let cellContent = '';
    if (paneContent) {
      // Find the first .container inside the pane that holds the main content
      let blockContainer = paneContent.querySelector('.container');
      if (blockContainer && blockContainer.childNodes.length > 0) {
        cellContent = blockContainer;
      } else {
        // If not found, fallback to whole pane
        cellContent = paneContent;
      }
    }
    return [titleSpan, cellContent];
  });

  // Build the table
  const cells = [headerRow, ...rows];
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
