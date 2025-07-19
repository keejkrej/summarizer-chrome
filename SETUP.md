# Chrome AI Summarizer Setup Guide

## Prerequisites
- Chrome version 129 or higher (check at `chrome://version`)
- Chrome Canary or Dev channel recommended for latest AI features

## Enable Chrome AI Features

1. **Enable Required Flags**
   - Navigate to `chrome://flags`
   - Search and enable these flags:
     - `Summarization API for Gemini Nano` → Set to "Enabled"
     - `Enables optimization guide on device` → Set to "Enabled BypassPerfRequirement"
     - `Prompt API for Gemini Nano` → Set to "Enabled" (if available)
   - Click "Relaunch" to restart Chrome

2. **Verify AI Model Installation**
   - Go to `chrome://components/`
   - Look for "Optimization Guide On Device Model"
   - Click "Check for update" if status shows "Component not updated"
   - Wait for download to complete (may take several minutes)

3. **Test AI Availability**
   - Open DevTools Console (F12)
   - Type: `window.ai`
   - Should return an object, not undefined

## Install Extension

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this extension folder
5. Note the Extension ID for origin trial (if needed)

## Troubleshooting

### "AI APIs are not available" Error
- Ensure all flags are enabled correctly
- Check Chrome version (must be 129+)
- Wait for AI model to download completely
- Try Chrome Canary if using stable Chrome

### Model Download Issues
- Requires stable internet connection
- May take 5-30 minutes depending on connection
- Check `chrome://components/` for download progress

### Still Not Working?
- Clear browser cache and restart
- Try disabling other extensions temporarily
- Check console for specific error messages