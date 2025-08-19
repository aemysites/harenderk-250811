/* global WebImporter */
export default function parse(element, { document }) {
  // 1. Collect all columns (content in each column)
  const columns = [];

  // Grabbing the 3 footer accordion columns
  const containerLinks = element.querySelector('.container__links');
  if (containerLinks) {
    const accordions = Array.from(containerLinks.querySelectorAll(':scope > .accordion'));
    accordions.forEach((accordion) => {
      // Compose cell contents: Title, then list of links
      const btn = accordion.querySelector('.cmp-accordion__button');
      const panel = accordion.querySelector('.cmp-accordion__panel');
      const cellContent = [];
      if (btn) {
        const strong = document.createElement('strong');
        strong.textContent = btn.childNodes[0].textContent.trim();
        cellContent.push(strong);
      }
      if (panel) {
        const ul = panel.querySelector('ul.child-links');
        if (ul) cellContent.push(ul);
      }
      columns.push(cellContent);
    });
  }

  // Grabbing the social/download/awards column
  const socialLinks = element.querySelector('.social-links.non-mobile');
  if (socialLinks) {
    const cellContent = [];
    // Social heading and icons
    const h3s = socialLinks.querySelectorAll('h3');
    const headings = Array.from(h3s).map(h => h.textContent.trim().toLowerCase());
    // Social
    const idxSocial = headings.indexOf('social');
    if (idxSocial !== -1) cellContent.push(h3s[idxSocial]);
    const socialMediaUl = socialLinks.querySelector('ul.social-links__media');
    if (socialMediaUl) cellContent.push(socialMediaUl);
    // WhatsApp
    const whatsappDivs = socialLinks.querySelectorAll('.social-links__whatsappSupport');
    if (whatsappDivs[0]) cellContent.push(whatsappDivs[0]);
    // Download
    const idxDownload = headings.indexOf('download');
    if (idxDownload !== -1) cellContent.push(h3s[idxDownload]);
    if (whatsappDivs[1]) cellContent.push(whatsappDivs[1]);
    // Our Awards
    const idxAwards = headings.indexOf('our awards');
    if (idxAwards !== -1) cellContent.push(h3s[idxAwards]);
    if (whatsappDivs[2]) cellContent.push(whatsappDivs[2]);
    columns.push(cellContent);
  }

  // 2. Compose table: header row (single column), content row (columns)
  // This produces a table where the header row is a single cell above the multi-column second row.
  const cells = [
    ['Columns (columns64)'],
    columns
  ];

  // 3. Build table and replace
  const table = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(table);
}
