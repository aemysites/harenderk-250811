/* global WebImporter */
export default function parse(element, { document }) {
  // Create table rows with the header first
  const rows = [['Carousel (carousel24)']];

  // Get the shared image element from the left panel
  let imgEl = null;
  const leftCol = element.querySelector('.row .col-md-2');
  if (leftCol) {
    imgEl = leftCol.querySelector('.ig-alert-img img');
  }

  // For each slide, insert a clone of the image element in the first cell
  const slidesWrapper = element.querySelector('.row .col-md-10');
  if (slidesWrapper && imgEl) {
    const slides = slidesWrapper.querySelectorAll('.slick-slide');
    slides.forEach((slide) => {
      const col = slide.querySelector('.col');
      if (col) {
        const imageClone = imgEl.cloneNode(true);
        rows.push([imageClone, col]);
      }
    });
  }

  const table = WebImporter.DOMUtils.createTable(rows, document);
  element.replaceWith(table);
}
