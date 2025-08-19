/* global WebImporter */
export default function parse(element, { document }) {
  // Find the main card section (.addonsandservices.section)
  let blockSection = element.querySelector('.addonsandservices.section');
  if (!blockSection) blockSection = element;

  // Find the card grid container (.row.commonAdOnsWrap)
  let cardRow = blockSection.querySelector('.row.commonAdOnsWrap');
  if (!cardRow) {
    // fallback - find all .commonBottomAdon inside .addonsandservices.section
    cardRow = blockSection;
  }

  // Find card nodes (direct children with .commonBottomAdon)
  const cardNodes = Array.from(cardRow.querySelectorAll('.commonBottomAdon'));
  const cards = [];

  cardNodes.forEach(cardNode => {
    // IMAGE: first <img> inside the cardNode
    const imgEl = cardNode.querySelector('img');

    // TEXT: include all .ig-common-desc-top content (contains title and subtitle)
    let textEls = [];
    const descTop = cardNode.querySelector('.ig-common-desc-top');
    if (descTop) {
      // Collect all child nodes (preserves markup/semantics)
      textEls = Array.from(descTop.childNodes).filter(n => {
        // Only include element or text nodes
        return n.nodeType === 1 || (n.nodeType === 3 && n.textContent.trim());
      });
    } else {
      // fallback: find any <h6> and <p>
      const h6 = cardNode.querySelector('h6');
      const p = cardNode.querySelector('p');
      if (h6) textEls.push(h6);
      if (p) textEls.push(p);
    }

    // CTA: find the <a> wrapping the button in .ctaWrap and use the link with label as text
    let ctaLink = null;
    const ctaWrap = cardNode.querySelector('.ctaWrap');
    if (ctaWrap) {
      const ctaCandidates = Array.from(ctaWrap.querySelectorAll('a[href]'));
      for (const a of ctaCandidates) {
        const btn = a.querySelector('button');
        if (btn) {
          a.textContent = btn.textContent.trim();
          ctaLink = a;
          break;
        }
      }
    }
    if (ctaLink) textEls.push(ctaLink);

    // Only push the card if both image and text content present
    if (imgEl && textEls.length) {
      cards.push([imgEl, textEls]);
    }
  });

  // Header row as specified in the instruction/example
  const headerRow = ['Cards (cards97)'];

  // Compose the table data
  const tableCells = [headerRow, ...cards];

  // Create table and replace the element
  const block = WebImporter.DOMUtils.createTable(tableCells, document);
  element.replaceWith(block);
}
