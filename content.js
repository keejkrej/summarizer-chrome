let summaryPopup = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "showSummary") {
    showSummaryPopup(request.summary, request.originalText);
  } else if (request.action === "showError") {
    showErrorPopup(request.error);
  }
});

function createPopupElement() {
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 400px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    padding: 20px;
    z-index: 999999;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    animation: slideIn 0.3s ease-out;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  
  return popup;
}

function showSummaryPopup(summary, originalText) {
  if (summaryPopup) {
    summaryPopup.remove();
  }
  
  summaryPopup = createPopupElement();
  
  summaryPopup.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #333; font-size: 18px; display: flex; align-items: center; gap: 10px;">
        <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">AI</div>
        Summary
      </h3>
      <button onclick="this.parentElement.parentElement.remove();" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;">×</button>
    </div>
    <div style="color: #555; line-height: 1.6; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #667eea;">
      ${escapeHtml(summary)}
    </div>
    ${originalText ? `
      <div style="margin-top: 15px; padding: 10px; background: #e9ecef; border-radius: 4px; font-size: 12px; color: #666; max-height: 100px; overflow-y: auto;">
        <div style="font-weight: bold; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; color: #888;">Original Text</div>
        ${escapeHtml(originalText.substring(0, 200))}${originalText.length > 200 ? '...' : ''}
      </div>
    ` : ''}
  `;
  
  document.body.appendChild(summaryPopup);
  
  setTimeout(() => {
    summaryPopup.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        summaryPopup.remove();
      }
    });
  }, 100);
}

function showErrorPopup(error) {
  if (summaryPopup) {
    summaryPopup.remove();
  }
  
  summaryPopup = createPopupElement();
  
  summaryPopup.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
      <h3 style="margin: 0; color: #dc3545; font-size: 18px;">Error</h3>
      <button onclick="this.parentElement.parentElement.remove();" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999;">×</button>
    </div>
    <div style="color: #dc3545; padding: 15px; background: #f8d7da; border-radius: 6px;">
      ${escapeHtml(error)}
    </div>
  `;
  
  document.body.appendChild(summaryPopup);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}