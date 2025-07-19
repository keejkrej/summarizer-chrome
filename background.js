let currentSummary = '';

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize",
    title: "Summarize",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarize" && info.selectionText) {
    try {
      // Check if Summarizer API is available
      if (!('Summarizer' in self)) {
        throw new Error("Summarizer API is not supported. Please use Chrome 138+ with AI features enabled.");
      }

      // Check availability
      const availability = await Summarizer.availability();
      if (availability === 'unavailable') {
        throw new Error("Summarizer API is not available on this device. Please check hardware requirements.");
      }

      // Show progress only if model needs to be downloaded
      let showProgress = false;
      if (availability === 'downloadable' || availability === 'downloading') {
        showProgress = true;
        sendMessageToTab(tab.id, {
          action: "showProgress",
          progress: 0
        });
      } else if (availability === 'available') {
        // Show brief processing message when model is ready
        sendMessageToTab(tab.id, {
          action: "showProcessing"
        });
      }

      // Create summarizer with options
      const summarizer = await Summarizer.create({
        type: 'key-points',
        format: 'markdown',
        length: 'medium',
        monitor(m) {
          if (showProgress) {
            m.addEventListener('downloadprogress', (e) => {
              console.log(`Download progress: ${e.loaded}/${e.total}`);
              // Send progress to content script with error handling
              sendMessageToTab(tab.id, {
                action: "showProgress",
                progress: e.loaded / e.total
              });
            });
          }
        }
      });

      // Generate summary
      const summary = await summarizer.summarize(info.selectionText, {
        context: 'This is text selected by a user from a webpage.'
      });

      currentSummary = summary;
      
      // Store summary locally
      chrome.storage.local.set({ 
        lastSummary: summary,
        originalText: info.selectionText 
      });

      // Send summary to content script with error handling
      sendMessageToTab(tab.id, {
        action: "showSummary",
        summary: summary,
        originalText: info.selectionText
      });
      
    } catch (error) {
      console.error('Error summarizing:', error);
      sendMessageToTab(tab.id, {
        action: "showError",
        error: error.message
      });
    }
  }
});

// Helper function to safely send messages to tabs
async function sendMessageToTab(tabId, message) {
  try {
    // Check if the tab still exists
    const tab = await chrome.tabs.get(tabId);
    if (tab && tab.status === 'complete') {
      await chrome.tabs.sendMessage(tabId, message);
    } else {
      console.warn('Tab not available for message sending:', tabId);
    }
  } catch (error) {
    console.warn('Failed to send message to tab:', tabId, error.message);
    // Don't throw the error, just log it
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLastSummary") {
    chrome.storage.local.get(['lastSummary', 'originalText'], (result) => {
      sendResponse(result);
    });
    return true;
  }
});