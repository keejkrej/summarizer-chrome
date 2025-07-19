# Chrome AI Text Summarizer Extension

A Chrome extension that uses Chrome's on-device AI API to summarize selected text.

## Features

- Right-click on selected text to summarize
- Uses Chrome's built-in AI for on-device processing
- Shows summaries in a popup overlay
- Stores last summary in extension popup

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `chrome-summarizer-extension` directory

## Requirements

- Chrome 127+ with AI Origin Trial enabled
- The Chrome AI API must be available on your device

## Usage

1. Select any text on a webpage
2. Right-click and choose "Summarize"
3. A popup will appear with the AI-generated summary
4. Click the extension icon to see the last summary

## Note

The Chrome AI API is currently experimental and requires:
- Chrome Dev/Canary channel
- Enabling specific flags or origin trials
- May not be available on all devices