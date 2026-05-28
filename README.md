# Shopify Agent — AI-Powered Business Builder

A 5-phase AI guide that helps you launch a Shopify digital product business. Powered by Claude (Anthropic).

---

## What You Get

| Phase | Output |
|---|---|
| 1 · Niche Discovery | 3 profitable niche recommendations matched to your skills & budget |
| 2 · Digital Product Creation | 5 product ideas with pricing, tools, and creation timelines |
| 3 · Store Setup & Branding | Store name, taglines, brand voice, About page copy, homepage hero |
| 4 · Marketing Content | 10 social posts, 5-email welcome sequence, Pinterest pins, ad copy |
| 5 · 30-Day Launch Plan | Day-by-day plan with tasks, checkpoints, and troubleshooting |

---

## Before You Start

You need two things installed on your computer:

1. **Node.js 18+** — download from [nodejs.org](https://nodejs.org) (choose the LTS version)
   - To check if you have it: open Terminal and type `node --version` — it should show `v18` or higher
2. **An Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)
   - Create an account, add a payment method, then go to API Keys and create a new key
   - Cost: roughly $0.10–0.30 for a full 5-phase run

---

## Setup (Step by Step)

### Step 1 — Open Terminal

- **Mac:** Press `Cmd + Space`, type `Terminal`, hit Enter
- **Windows:** Press `Win + R`, type `cmd`, hit Enter

### Step 2 — Navigate to the project folder

Type this exactly (copy-paste recommended):

```
cd ~/Desktop/Shopify\ Agent
```

> If that doesn't work, try dragging the folder into the Terminal window after typing `cd ` (with a space).

Confirm it worked — your terminal prompt should show `Shopify Agent`.

### Step 3 — Install dependencies

```
npm run install:all
```

This installs everything needed. It takes 1–2 minutes. You'll see a lot of text — that's normal. Wait until you get your prompt back.

### Step 4 — Add your API key

The `.env` file is hidden and won't show up in Finder or File Explorer. Use this Terminal command instead — it creates the file for you automatically.

**Paste this into Terminal** (still inside the `Shopify Agent` folder), replacing `sk-ant-YOUR-KEY-HERE` with your actual key:

```
printf 'ANTHROPIC_API_KEY=sk-ant-YOUR-KEY-HERE\nPORT=3001\nCLAUDE_MODEL=claude-sonnet-4-6\n' > backend/.env
```

Your key starts with `sk-ant-` and you can copy it from [console.anthropic.com](https://console.anthropic.com) → API Keys.

To confirm it worked, run:
```
cat backend/.env
```
You should see your key printed on the first line.

### Step 5 — Start the app

```
npm start
```

Two servers start up. When you see something like:

```
  ➜  Local:   http://localhost:3000/
```

open [http://localhost:3000](http://localhost:3000) in your browser.

---

## To Stop the App

Press `Ctrl + C` in the Terminal window.

To start again later, just do Step 2 + Step 5 (navigate to the folder, then `npm start`).

---

## Troubleshooting

**`command not found: npm`**
Node.js is not installed. Download it from [nodejs.org](https://nodejs.org) (LTS version), install it, then restart your Terminal and try again.

**`cd: no such file or directory`**
The folder path is wrong. Try:
- Typing `cd ` (with a space after) then dragging the `Shopify Agent` folder from your desktop into Terminal
- Or: `cd ~/Desktop` then `ls` to see the exact folder name, then `cd` into it

**`npm run install:all` gives errors**
Try running each install manually:
```
npm install
npm install --prefix backend
npm install --prefix frontend
```

**`Error: ANTHROPIC_API_KEY is not set` or API errors**
- Open `backend/.env` and confirm your key is there (not the placeholder text)
- Make sure there are no extra spaces or quotes around the key
- Confirm the key is active at [console.anthropic.com](https://console.anthropic.com)

**Port already in use**
Another process is using port 3001 or 3000. Restart your computer and try `npm start` again.

**App opens but nothing loads / blank screen**
Hard-refresh the browser: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows).

---

## Customizing the AI Model

Edit `backend/.env` and change `CLAUDE_MODEL`:

- `claude-sonnet-4-6` — fast, great quality (default)
- `claude-opus-4-7` — highest quality, slower, slightly more expensive

---

## Questions?

Check that:
1. Your API key in `backend/.env` starts with `sk-ant-`
2. You ran `npm start` from inside the `Shopify Agent` folder (not from inside `backend` or `frontend`)
3. Node version is 18+ (`node --version`)
