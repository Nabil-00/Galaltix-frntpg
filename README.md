# Galaltix Frontpage

Galaltix Frontpage is the public-facing marketing website for Galaltix, focused on showcasing products, services, and lead-capture flows for export and trade operations.

## Project Scope

- Multi-page marketing site (home, products, services, contact, team)
- Product detail pages for export commodities
- Service detail pages for trade and logistics offerings
- Contact and quote-request form flows
- Static deployment support for Vercel

## Stack

- HTML, CSS, JavaScript
- Bootstrap-based template foundation
- EmailJS/contact integration docs included in-repo

## Local Development

This is a static site and can be served with any local static server.

Example:

```bash
npx serve .
```

Or open `index.html` directly for quick preview.

## Deployment

- `vercel.json` is included for Vercel deployment
- Additional setup guides are included:
  - `DEPLOYMENT.md`
  - `EMAILJS_SETUP.md`
  - `RECAPTCHA_SETUP.md`
  - `FIREBASE_SETUP.md`

## Repository Notes

This repository contains multiple operational docs from iterative updates. Keep production settings and API keys in platform secrets, not in committed files.
