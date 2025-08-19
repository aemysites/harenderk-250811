/* global WebImporter */
export default function parse(element, { document }) {
  // Locate the feedback form block (sandbox-form)
  const feedbackFormContainer = element.querySelector('.sandbox-form');
  if (!feedbackFormContainer) return;

  // Find the instruction/description
  let leftColContent = [];
  const feedbackTitle = feedbackFormContainer.querySelector('.feedbackTitle');
  if (feedbackTitle) {
    // Look for the paragraph with instruction text
    const para = feedbackTitle.querySelector('p.para');
    if (para) leftColContent.push(para);
  }

  // Find the form itself (the main element on the right)
  let rightColContent = [];
  const form = feedbackFormContainer.querySelector('form.indigo-feedback-form');
  if (form) rightColContent.push(form);

  // Only create the table if we have form (main content)
  if (rightColContent.length === 0) return;

  // Table header row exactly as required
  const headerRow = ['Columns (columns95)'];
  // Content row: left is instruction (if present), right is the form
  const contentRow = [leftColContent, rightColContent];
  const cells = [headerRow, contentRow];

  const block = WebImporter.DOMUtils.createTable(cells, document);

  // Replace the element with block table
  element.replaceWith(block);
}
