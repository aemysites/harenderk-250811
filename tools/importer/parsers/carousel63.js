/* global WebImporter */
export default function parse(element, { document }) {
  // --- 1. Header Row: must match example ---
  const headerRow = ['Carousel (carousel63)'];

  // --- 2. Gather all slide elements from every visible tab-pane ---
  // Each .tab-pane contains a .promotional-slide > .promotional-slide--carosuel
  // Each .promotional-slide--carosuel contains .slick-slide elements
  const slideItems = [];
  element.querySelectorAll('.tab-pane').forEach(tabPane => {
    const carousel = tabPane.querySelector('.promotional-slide--carosuel');
    if (!carousel) return;
    // For each slide
    carousel.querySelectorAll('.slick-slide').forEach(slickSlide => {
      // Defensive: get the core .promotional-slide--carosuel--item (should always exist)
      const item = slickSlide.querySelector('.promotional-slide--carosuel--item');
      if (item) {
        slideItems.push(item);
      }
    });
  });

  // --- 3. Build rows for each slide ---
  const rows = slideItems.map(item => {
    // Left cell: the image element
    let imgCell = null;
    // Right cell: text content (title, description, CTA)
    let textCell = null;
    
    const link = item.querySelector('a.promotional-slide--redirection');
    if (link) {
      // Image
      const imgDiv = link.querySelector('.get-inspired-carausel--picture');
      if (imgDiv) {
        const img = imgDiv.querySelector('img');
        if (img) imgCell = img;
      }
      // Text content
      const descDiv = link.querySelector('.get-inspired-carausel--description');
      if (descDiv) {
        const frag = document.createElement('div');
        // Title (h6 becomes h2 per semantic best-practice)
        const title = descDiv.querySelector('.get-inspired-carausel--title');
        if (title && title.textContent.trim()) {
          const h2 = document.createElement('h2');
          h2.textContent = title.textContent;
          frag.appendChild(h2);
        }
        // Subtitle (can contain <p>, HTML, etc)
        const subtitle = descDiv.querySelector('.get-inspired-carausel--subtitle');
        if (subtitle) {
          // Append all children (usually a <p>)
          Array.from(subtitle.childNodes).forEach(node => {
            frag.appendChild(node);
          });
        }
        // CTA (call-to-action): always use the link at bottom if href is present
        if (link.href && link.href !== '#') {
          // Use the block title as CTA if present
          let linkText = title?.textContent?.trim() || link.textContent.trim();
          const cta = document.createElement('a');
          cta.href = link.href;
          cta.textContent = linkText;
          cta.target = '_blank';
          frag.appendChild(document.createElement('br'));
          frag.appendChild(cta);
        }
        textCell = frag;
      }
    }
    // Defensive: ensure we always have cells
    return [imgCell, textCell];
  });

  // --- 4. Create the table ---
  const cells = [headerRow, ...rows];
  const block = WebImporter.DOMUtils.createTable(cells, document);

  // --- 5. Replace original element ---
  element.replaceWith(block);
}
