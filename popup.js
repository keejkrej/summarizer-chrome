document.addEventListener('DOMContentLoaded', async () => {
  const contentDiv = document.getElementById('content');
  
  try {
    const response = await chrome.runtime.sendMessage({ action: "getLastSummary" });
    
    if (response && response.lastSummary) {
      displaySummary(response.lastSummary, response.originalText);
    }
  } catch (error) {
    console.error('Error loading summary:', error);
  }
});

function displaySummary(summary, originalText) {
  const contentDiv = document.getElementById('content');
  
  let html = `<div class="summary-content">${escapeHtml(summary)}</div>`;
  
  if (originalText) {
    html += `
      <div class="original-text">
        <h3>Original Text</h3>
        ${escapeHtml(originalText.substring(0, 200))}${originalText.length > 200 ? '...' : ''}
      </div>
    `;
  }
  
  contentDiv.innerHTML = html;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}