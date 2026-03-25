# TheAITimeline — Claude Code Instructions

## About this project
- 11ty (Eleventy) static blog
- GitHub repo: akaaja2/theaitimeline-blog
- Live site: https://theaitimeline.netlify.app/
- Posts live in: src/posts/
- Deploy: pushing to main triggers Netlify auto-deploy

## Publishing a new post

### File naming
src/posts/YYYY-MM-DD-slug.md

### Required frontmatter
---
title: "Post Title Here"
description: "One sentence summary"
date: YYYY-MM-DD
tags: [post]
layout: layouts/post.njk
---

### Publishing steps
1. Write the post as a .md file with correct frontmatter
2. Commit with message: "Add post: [title]"
3. Push to origin/main using gh CLI
4. Confirm push succeeded

## Writing style
- Tone: Neutral/informational (explain, don't editorialize)
- Length: 300–600 words unless otherwise specified
- Use subheadings for posts over 400 words
- Write for humans, not search engines

## Do not
- Modify any files in _site/
- Change .eleventy.js without being asked
- Push to any branch other than main

## Eleventy 3.x compatibility notes
- Date filter uses toLocaleDateString with en-US locale for %B %d, %Y
- Use post.content not post.templateContent in collection loops
- All passthrough assets must be declared in .eleventy.js

## Build
- npm run build → eleventy + pagefind
- npm start → local dev server at localhost:8080
- Push to main → Netlify auto-deploys in ~20s
