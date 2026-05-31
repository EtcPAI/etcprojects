# {{CLIENT_NAME}} — Website

Production site for **{{CLIENT_NAME}}**, hosted on Vercel.

- **Live:** https://{{DOMAIN}}
- **Preview deploys:** every push to a non-`main` branch gets its own URL.
- **Production deploys:** every push to `main` is deployed automatically.

## Requesting a change

You have two options:

1. **Use the update form:** https://updates.yourdomain.com — pick "{{CLIENT_NAME}}",
   fill in what you'd like changed. This is the easiest path and works without a
   GitHub account.
2. **Open a GitHub issue directly:** click the *Issues* tab above → *New issue* →
   pick "Update request" or "Bug report". Useful if you want to attach files or
   discuss in a thread.

Either way, the request lands in this repo and we'll respond within one
business day.

See `docs/how-to-request-updates.md` for the full guide and
`docs/your-site-guide.md` for an overview of your site.

## For developers

```bash
# Static site — open index.html directly, or:
npx serve .
```

Deploys are managed by Vercel. Environment variables and domains are configured
in the Vercel project, not in this repo.
