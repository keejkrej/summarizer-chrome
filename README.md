# Chrome AI Text Summarizer Extension

A Chrome extension that uses Chrome's built-in Summarizer API to summarize selected text.

## Features

- Right-click on selected text to summarize
- Uses Chrome's built-in Summarizer API for on-device processing
- Shows summaries in a popup overlay with progress tracking
- Stores last summary in extension popup
- Supports markdown formatting in summaries
- Real-time download progress for AI models

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the extension directory

## Requirements

- Chrome 138+ with AI features enabled
- The Chrome Summarizer API must be available on your device
- Hardware requirements: Device must support Chrome's AI features

## Usage

1. Select any text on a webpage
2. Right-click and choose "Summarize"
3. A popup will appear showing download progress (on first use)
4. Once complete, the AI-generated summary will be displayed
5. Click the extension icon to see the last summary

## API Features

This extension uses Chrome's official Summarizer API with the following configuration:
- **Type**: Key points summary
- **Format**: Markdown
- **Length**: Medium
- **Context**: Webpage text selection

## Technical Details

The extension leverages Chrome's built-in `Summarizer` API which:
- Runs entirely on-device for privacy
- Requires no external API keys or internet connection
- Automatically downloads and manages AI models
- Provides real-time progress updates during model downloads

## Note

The Chrome Summarizer API is available in Chrome 138+ stable and requires:
- Chrome with AI features enabled
- Compatible hardware for AI processing
- May require initial model download on first use