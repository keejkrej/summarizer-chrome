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
      // Debug logging
      console.log("Checking AI availability...");
      console.log("self.ai:", self.ai);
      console.log("chrome.ai:", chrome.ai);
      console.log("globalThis.ai:", globalThis.ai);
      
      // Try different ways to access AI
      const ai = self.ai || chrome.ai || globalThis.ai;
      
      if (!ai || !ai.summarizer) {
        // Log more details for debugging
        console.error("AI not found. Available APIs:", {
          self: Object.keys(self).filter(k => k.includes('ai')),
          chrome: Object.keys(chrome).filter(k => k.includes('ai')),
          globalThis: Object.keys(globalThis).filter(k => k.includes('ai'))
        });
        throw new Error("Chrome AI APIs are not available. Please ensure you're using Chrome 129+ and have enabled AI features.");
      }
      
      const canSummarize = await ai.summarizer.capabilities();
      let summarizer;

      if (canSummarize && canSummarize.available !== 'no') {
        if (canSummarize.available === 'readily') {
          summarizer = await ai.summarizer.create();
        } else {
          summarizer = await ai.summarizer.create();
          summarizer.addEventListener('downloadprogress', (e) => {
            console.log(`Download progress: ${e.loaded}/${e.total}`);
          });
          await summarizer.ready;
        }

        const summary = await summarizer.summarize(info.selectionText);
        currentSummary = summary;
        
        chrome.storage.local.set({ 
          lastSummary: summary,
          originalText: info.selectionText 
        });

        chrome.tabs.sendMessage(tab.id, {
          action: "showSummary",
          summary: summary,
          originalText: info.selectionText
        });
        
        summarizer.destroy();
      } else {
        chrome.tabs.sendMessage(tab.id, {
          action: "showError",
          error: "AI Summarizer is not available on this device"
        });
      }
    } catch (error) {
      console.error('Error summarizing:', error);
      chrome.tabs.sendMessage(tab.id, {
        action: "showError",
        error: error.message
      });
    }
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getLastSummary") {
    chrome.storage.local.get(['lastSummary', 'originalText'], (result) => {
      sendResponse(result);
    });
    return true;
  }
});