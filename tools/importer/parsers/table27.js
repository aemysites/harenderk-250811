/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Table (table27)'];
  // Collect all relevant seat fee tables and their context blocks
  // We want each table and its heading and related content, keeping the structure as a block per table
  // This function is robust to variations in the container structure
  // Will reference the entire parent context block that contains each table

  // Helper: get all context blocks that contain a seat-fee table
  // This includes .container.container-mob, div[data-items], and (for international) divs that have a table
  // We avoid cloning, and just reference these context blocks directly
  const blocks = [];

  // 1. Main workflow: find all .textblock.section blocks that contain tables
  const sections = element.querySelectorAll('.textblock.section');
  for (const section of sections) {
    // Find all context sub-blocks that contain a table
    let candidates = [];
    // If there is a .container.container-mob directly inside, reference that
    candidates = Array.from(section.querySelectorAll('.container.container-mob'));
    // Also look for direct <div data-items> blocks
    const dataItemsBlocks = Array.from(section.querySelectorAll('div[data-items]'));
    candidates = candidates.concat(dataItemsBlocks);
    // Also check if section itself contains a table and has no container-mob
    if (candidates.length === 0 && section.querySelector('table')) {
      candidates = [section];
    }
    for (const candidate of candidates) {
      // Only add if there's a table within
      if (candidate.querySelector('table')) {
        blocks.push(candidate);
      }
    }
  }
  // 2. For international tab-pane, the blocks may be direct children of .tab-pane
  // So walk through each tab-pane
  const tabPanes = element.querySelectorAll('.tab-pane');
  for (const tabPane of tabPanes) {
    // For each table, collect its relevant context: preceding <p> with <b>, the <a.seatmap>, and the <table>
    let node = tabPane.firstElementChild;
    while (node) {
      if (node.tagName && node.tagName.toLowerCase() === 'table') {
        // Get up to 2 previous <p> siblings (seat fee heading and/or aircraft), and a preceding <a.seatmap>
        const group = [];
        let prev = node.previousElementSibling;
        while (prev && (prev.tagName && prev.tagName.toLowerCase() === 'p' || (prev.tagName && prev.tagName.toLowerCase() === 'a' && prev.classList.contains('seatmap')))) {
          group.unshift(prev);
          prev = prev.previousElementSibling;
        }
        // Wrap in a div for single referencing
        const div = document.createElement('div');
        for (const el of group) div.appendChild(el);
        div.appendChild(node);
        blocks.push(div);
      }
      node = node.nextElementSibling;
    }
  }
  // 3. Remove duplicates
  const uniqueBlocks = [];
  blocks.forEach(block => {
    if (!uniqueBlocks.includes(block)) {
      uniqueBlocks.push(block);
    }
  });

  // 4. Add ATR tables (they may be duplicate, but above logic should have caught)
  // 5. Compose final cells array: [headerRow], then [block] for each block that contains a table
  const cells = [headerRow];
  uniqueBlocks.forEach(block => {
    // Only add blocks that have at least one table
    if (block.querySelector('table')) {
      cells.push([block]);
    }
  });

  // 6. Table creation and replace
  const blockTable = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(blockTable);
}
