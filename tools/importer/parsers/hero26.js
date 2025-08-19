/* global WebImporter */
export default function parse(element, { document }) {
  // Helper: gets immediate child by class from an element
  function getDirectChildByClass(parent, className) {
    for (const child of parent.children) {
      if (child.classList.contains(className)) return child;
    }
    return null;
  }
  // 1. Get the section structure
  const section = element.querySelector('.static-banner-section');
  let imageElem = null;
  let bannerContent = null;

  if (section) {
    // Find <a> direct child of section
    const linkElem = getDirectChildByClass(section, ''); // just <a>
    const aElem = linkElem || section.querySelector('a');
    if (aElem) {
      // Find .bckgrd-tupple direct child of <a>
      const tupleElem = getDirectChildByClass(aElem, 'bckgrd-tupple');
      if (tupleElem) {
        // Find all img elements
        const imgs = tupleElem.querySelectorAll('img');
        // Prefer first non-base64 src image for desktop
        imageElem = Array.from(imgs).find(img => {
          const src = img.getAttribute('src') || '';
          return src && !src.startsWith('data:');
        }) || imgs[0] || null;
        // Find banner-content direct child
        bannerContent = getDirectChildByClass(tupleElem, 'banner-content');
      }
    }
  }

  // 2. Build header row
  const headerRow = ['Hero (hero26)'];
  // 3. Build image row
  const imageRow = [imageElem ? imageElem : ''];
  // 4. Build content row (always reference the block)
  const contentRow = [bannerContent ? bannerContent : ''];

  // 5. Compose table
  const cells = [headerRow, imageRow, contentRow];
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
