let summaryPopup = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    if (request.action === "showSummary") {
      showSummaryPopup(request.summary, request.originalText);
    } else if (request.action === "showError") {
      showErrorPopup(request.error);
    } else if (request.action === "showProgress") {
      showProgressPopup(request.progress);
    } else if (request.action === "showProcessing") {
      showProcessingPopup();
    }
  } catch (error) {
    console.error('Error handling message in content script:', error);
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
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
  
  return popup;
}

function showProcessingPopup() {
  try {
    if (summaryPopup) {
      summaryPopup.remove();
    }
    
    summaryPopup = createPopupElement();
    
    summaryPopup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #333; font-size: 18px; display: flex; align-items: center; gap: 10px;">
          <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">AI</div>
          Processing
        </h3>
      </div>
      <div style="text-align: center; padding: 20px;">
        <div style="width: 30px; height: 30px; border: 3px solid #f3f3f3; border-top: 3px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
        <div style="color: #666; font-size: 14px;">Generating summary...</div>
      </div>
    `;
    
    document.body.appendChild(summaryPopup);
  } catch (error) {
    console.error('Error showing processing popup:', error);
  }
}

function showProgressPopup(progress) {
  try {
    if (summaryPopup) {
      summaryPopup.remove();
    }
    
    summaryPopup = createPopupElement();
    
    const percentage = Math.round(progress * 100);
    
    summaryPopup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #333; font-size: 18px; display: flex; align-items: center; gap: 10px;">
          <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">AI</div>
          Loading AI Model
        </h3>
      </div>
      <div style="text-align: center; padding: 20px;">
        <div style="width: 100%; background: #e9ecef; border-radius: 10px; height: 8px; margin-bottom: 10px;">
          <div style="width: ${percentage}%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); height: 100%; border-radius: 10px; transition: width 0.3s ease;"></div>
        </div>
        <div style="color: #666; font-size: 14px;">Downloading AI model... ${percentage}%</div>
        <div style="color: #999; font-size: 12px; margin-top: 5px;">This may take a few moments on first use</div>
      </div>
    `;
    
    document.body.appendChild(summaryPopup);
  } catch (error) {
    console.error('Error showing progress popup:', error);
  }
}

function showSummaryPopup(summary, originalText) {
  try {
    if (summaryPopup) {
      summaryPopup.remove();
    }
    
    summaryPopup = createPopupElement();
    
    // Convert markdown to HTML
    const renderedSummary = renderMarkdown(summary);
    
    summaryPopup.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
        <h3 style="margin: 0; color: #333; font-size: 18px; display: flex; align-items: center; gap: 10px;">
          <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">AI</div>
          Summary
        </h3>
        <button onclick="this.parentElement.parentElement.remove();" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 4px; transition: background 0.2s;">×</button>
      </div>
      <div style="color: #555; line-height: 1.5; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 3px solid #667eea; font-size: 13px; max-height: 300px; overflow-y: auto;">
        ${renderedSummary}
      </div>
      ${originalText ? `
        <div style="margin-top: 15px; padding: 10px; background: #e9ecef; border-radius: 4px; font-size: 11px; color: #666; max-height: 80px; overflow-y: auto;">
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
  } catch (error) {
    console.error('Error showing summary popup:', error);
  }
}

function showErrorPopup(error) {
  try {
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
  } catch (error) {
    console.error('Error showing error popup:', error);
  }
}

function renderMarkdown(text) {
  try {
    // Simple markdown to HTML conversion
    let html = escapeHtml(text);
    
    // Convert bullet points (* or - to •)
    html = html.replace(/^[\s]*[\*\-][\s]+/gm, '• ');
    
    // Convert **bold** to <strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert *italic* to <em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert line breaks to <br>
    html = html.replace(/\n/g, '<br>');
    
    // Add some basic styling for bullet points
    html = html.replace(/• /g, '<span style="color: #667eea; margin-right: 8px;">•</span>');
    
    return html;
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return escapeHtml(text);
  }
}

function escapeHtml(text) {
  try {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  } catch (error) {
    console.error('Error escaping HTML:', error);
    return text || '';
  }
}