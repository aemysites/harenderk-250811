/* global WebImporter */
export default function parse(element, { document }) {
  // Block header
  const headerRow = ['Cards (cards23)'];

  // Find all the card elements containing the details
  // We look for all .eateryWrap.check-inWrap inside .comonMarginEatery
  const cardContainers = Array.from(element.querySelectorAll('.comonMarginEatery .eateryWrap.check-inWrap'));
  const rows = [];

  cardContainers.forEach(card => {
    // Image: find <picture> or <img> inside the card
    let imgEl = null;
    const picture = card.querySelector('picture');
    if (picture) {
      imgEl = picture;
    } else {
      const img = card.querySelector('img');
      if (img) imgEl = img;
    }

    // Text cell: include everything inside .eateryInnerWrap
    const inner = card.querySelector('.eateryInnerWrap');
    let textCell = [];
    if (inner) {
      // Title: span.landingpagesubheading as <strong>
      const title = inner.querySelector('.landingpagesubheading');
      if (title && title.textContent.trim()) {
        const strong = document.createElement('strong');
        strong.textContent = title.textContent.trim();
        textCell.push(strong);
      }

      // Description: get all <p> tags inside .text.whereto-eat-text
      const descPs = inner.querySelectorAll('.text.whereto-eat-text p');
      descPs.forEach(p => {
        // Wrap in a div for separation
        const descDiv = document.createElement('div');
        descDiv.innerHTML = p.innerHTML;
        textCell.push(descDiv);
      });

      // CTA: last <span> inside .eateryInnerWrap, if it contains 'More Information'
      const ctaSpans = inner.querySelectorAll('span');
      let ctaLabel = '';
      ctaSpans.forEach(span => {
        if (/More Information/i.test(span.textContent)) {
          ctaLabel = span.textContent.replace(/\s*\u2192|\u2794|→/g, '').trim();
        }
      });
      // Find the card's main <a> for the href
      const mainLink = card.querySelector('a.moreInfo');
      if (mainLink && mainLink.href && ctaLabel) {
        const cta = document.createElement('a');
        cta.href = mainLink.href;
        cta.textContent = ctaLabel;
        if (mainLink.target) cta.setAttribute('target', mainLink.target);
        textCell.push(cta);
      }
    }

    // Fallback: if inner is missing, use card's text
    if (!textCell.length) {
      textCell = [document.createTextNode(card.textContent.trim())];
    }

    // Add the card row
    rows.push([imgEl, textCell]);
  });

  // Compose table
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
