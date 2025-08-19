/* global WebImporter */
export default function parse(element, { document }) {
  // Table header as per block name
  const headerRow = ['Cards (cards89)'];

  // Find all cards in the block. Only direct children of element, not nested blocks.
  // Each card is a .boardofdirectors.section
  const cardSections = Array.from(element.querySelectorAll('.boardofdirectors.section'));
  
  const rows = cardSections.map(card => {
    // IMAGE: Look for the first <img> inside .col-md-4 .leaderImgWrap picture
    let imgEl = null;
    const imgWrap = card.querySelector('.col-md-4 .leaderImgWrap picture img');
    if (imgWrap) {
      imgEl = imgWrap;
    }

    // TEXT: Title, subtitle, and description
    const leaderTextWrap = card.querySelector('.col-md-8 .leaderTextWrap');
    let textContent = [];
    if (leaderTextWrap) {
      // Title (<h3>)
      const h3 = leaderTextWrap.querySelector('.leaderNameWrap h3');
      if (h3) textContent.push(h3);
      // Subtitle (<span>)
      const subtitle = leaderTextWrap.querySelector('.leaderNameWrap span');
      if (subtitle) textContent.push(subtitle);
      // All <p> for description (in order)
      const ps = leaderTextWrap.querySelectorAll('p');
      ps.forEach(p => textContent.push(p));
    }
    return [imgEl, textContent];
  });

  const table = WebImporter.DOMUtils.createTable([headerRow, ...rows], document);
  element.replaceWith(table);
}
