# Exam Helper

Exam Helper is a Next.js web app that uses the Anthropic API (Claude) to help you study from your own course materials. Upload a document — PDF, Word, or other office file — and get an AI-powered study assistant built around its content.

## Features

- 📄 **Document upload & parsing** — extracts text from PDFs (`pdf-parse`) and Office documents like `.docx`/`.pptx` (`officeparser`)
- 🤖 **AI-powered study help** — sends parsed content to Claude via the `@anthropic-ai/sdk` to generate answers, explanations, or practice material based on your uploaded document
- ⚡ **Modern web stack** — built with Next.js 14 (App Router), React 18, and TypeScript
- 🎨 **Styled with Tailwind CSS**

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router) |
| UI | React 18, TypeScript, Tailwind CSS |
| AI | [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript) (Claude) |
| Document parsing | `pdf-parse`, `officeparser` |
| Deployment | [Vercel](https://vercel.com/) |

## Project Structure

```
exam-helper/
├── app/          # Next.js App Router pages, layouts, and API routes
├── components/   # Reusable React components
├── lib/          # Shared utilities (e.g., document parsing, Claude API calls)
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
git clone https://github.com/mattusuquen/exam-helper.git
cd exam-helper
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
ANTHROPIC_API_KEY=your_api_key_here
```

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Other scripts

```bash
npm run build   # Production build
npm run start   # Start the production server
npm run lint    # Run ESLint
```

## Deployment

This project is set up to deploy easily on [Vercel](https://vercel.com/). Connect the repository, set the `ANTHROPIC_API_KEY` environment variable in your Vercel project settings, and deploy.

## License

No license has been specified for this project yet.

## Contributing

This is currently a personal/portfolio project. Issues and pull requests are welcome if you'd like to suggest improvements.
