/* global WebImporter */
export default function parse(element, { document }) {
  // Helper to get title from .faq-sb-heading > a (excluding icon)
  function getTitle(heading) {
    const anchor = heading.querySelector('a.faq-sb-acc-heading');
    if (anchor) {
      // Remove icon children for title text
      const anchorClone = anchor.cloneNode(true);
      Array.from(anchorClone.querySelectorAll('i')).forEach(i => i.remove());
      // Use textContent only
      return anchorClone.textContent.trim();
    }
    return heading.textContent.trim();
  }

  // Helper to get content from .faq-acc-inner-content (use referenced <p> element)
  function getContent(heading) {
    const contentDiv = heading.querySelector('.faq-acc-inner-content');
    if (contentDiv) {
      const ps = contentDiv.querySelectorAll('p');
      if (ps.length === 1) {
        return ps[0]; // Reference the <p> element itself
      } else if (ps.length > 1) {
        return Array.from(ps); // Reference all <p> elements
      } else {
        // If no <p>, include all child nodes that have meaningful content
        return Array.from(contentDiv.childNodes).filter(
          node => (node.nodeType === 1 || node.nodeType === 3) && node.textContent.trim()
        );
      }
    }
    return document.createTextNode("");
  }

  // Find the accordion group
  const sidebar = element.querySelector('.faq-side-bar.pt0');
  if (!sidebar) return;
  const accGroup = sidebar.querySelector('.faq-sb-acc-group.faq-top-queries');
  if (!accGroup) return;

  // Find all direct accordion headings
  const headings = Array.from(accGroup.querySelectorAll(':scope > .faq-sb-heading'));
  if (!headings.length) return;

  // Table header row
  const headerRow = ['Accordion (accordion41)'];
  const rows = [headerRow];

  // Each row: [title, content] referencing existing elements
  headings.forEach(heading => {
    const title = getTitle(heading);
    const content = getContent(heading);
    rows.push([title, content]);
  });

  // Create and replace with block table
  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
