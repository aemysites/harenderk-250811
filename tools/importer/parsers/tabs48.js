/* global WebImporter */
export default function parse(element, { document }) {
  // Extract the containers for each logical tab step
  const firstScreen = element.querySelector('.forgot-pass-first-screen');
  const secondScreen = element.querySelector('.forgot-pass-second-screen');
  const thirdScreen = element.querySelector('.forgot-pass-third-screen');
  const successModal = element.querySelector('#reset-password-success-modal');

  // Only add rows for containers that exist
  const tabs = [];
  if (firstScreen) tabs.push(['Mobile Verification', firstScreen]);
  if (secondScreen) tabs.push(['OTP Entry', secondScreen]);
  if (thirdScreen) tabs.push(['Reset Password', thirdScreen]);
  if (successModal) tabs.push(['Success Modal', successModal]);

  // Compose the table rows: first header, then one row per tab (label, content)
  const cells = [
    ['Tabs (tabs48)'],
    ...tabs
  ];

  // Create and replace
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
