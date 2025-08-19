/* global WebImporter */
export default function parse(element, { document }) {
  // Get the two main columns inside the .row
  const container = element.querySelector('.container.container-mob');
  if (!container) return;
  const appDownloadWrapper = container.querySelector('.app-download-wrapper');
  if (!appDownloadWrapper) return;
  const row = appDownloadWrapper.querySelector('.row');
  if (!row) return;
  const cols = row.querySelectorAll(':scope > div');
  if (cols.length < 2) return;
  const leftCol = cols[0];
  const rightCol = cols[1];

  // LEFT COLUMN: main app image + app screenshots
  const leftItems = [];
  // Main illustration
  const mainImg = leftCol.querySelector('img.app-main-img');
  if (mainImg) leftItems.push(mainImg);
  // App screenshots from slick slider
  const sliderImgs = Array.from(leftCol.querySelectorAll('.download-image-slider img'));
  sliderImgs.forEach(img => {
    // Avoid duplicating mainImg
    if (!mainImg || img.src !== mainImg.src) leftItems.push(img);
  });

  // RIGHT COLUMN: headline, paragraph, QR code, 'Or', quick link text, email input group, download buttons
  const rightItems = [];
  // Headline
  const h1 = rightCol.querySelector('h1');
  if (h1) rightItems.push(h1);
  // Description paragraph (first p)
  const descP = rightCol.querySelector('p');
  if (descP) rightItems.push(descP);
  // Scan QR instruction (style font-weight 600)
  const scanQrP = Array.from(rightCol.querySelectorAll('p')).find(
    p => p.textContent.trim().toLowerCase().includes('scan')
  );
  if (scanQrP) rightItems.push(scanQrP);
  // QR code image (img inside p, src contains 'qr')
  const qrImg = Array.from(rightCol.querySelectorAll('img')).find(img => img.src && img.src.toLowerCase().includes('qr'));
  if (qrImg) rightItems.push(qrImg);
  // 'Or' text
  const orP = Array.from(rightCol.querySelectorAll('p')).find(p => p.textContent.trim().toLowerCase() === 'or');
  if (orP) rightItems.push(orP);
  // Quick link prompt (p, font-weight 600, margin-bottom 0)
  const quickLinkP = Array.from(rightCol.querySelectorAll('p')).find(
    p => p.textContent.trim().toLowerCase().startsWith('we can send')
  );
  if (quickLinkP) rightItems.push(quickLinkP);
  // Email input group
  const emailGroup = rightCol.querySelector('.app-download-form .ig-input-group.email-id');
  if (emailGroup) rightItems.push(emailGroup);
  // Download buttons
  const downloadBtnDiv = rightCol.querySelector('.app-download-form .download-btn');
  if (downloadBtnDiv) rightItems.push(downloadBtnDiv);

  // Table construction
  const headerRow = ['Columns (columns39)'];
  const columnsRow = [leftItems, rightItems];

  const table = WebImporter.DOMUtils.createTable([
    headerRow,
    columnsRow
  ], document);
  element.replaceWith(table);
}
