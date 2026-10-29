# THEAICOMP — existing GitHub and Vercel project

Enhanced one-page website with Services, Work, About, NITDA/CPN recognition, Journal (Coming soon), and Contact.

## Verified deployment target

- GitHub repository: `aishaagwai-dev/theaicomp`
- Current production branch: `main`
- Existing Vercel project: `theaicomp` (`prj_VZt6vdWRjxG9idCPnfjPi148W3UA`)
- Vercel workspace: `aisha-agwai-mohammeds-projects`
- Domain: `www.theaicomp.ng`; `theaicomp.ng` redirects to it.
- Current deployment before this update: `dpl_73mJroDnDTvi3GCZjHv4uUkEP845`, source commit `51e0ec575378dfc0cef7b326f469af83f301cb1c`.

Keep this same project and repository to retain the domain and Git deployment connection.

## Contact form

The existing live website already uses Web3Forms. This package reuses its public submission key and submits with JavaScript, keeping visitors on the page. No Resend account, server-side email function, or new email environment variables are required. This package supersedes the earlier Resend export.

Submission has required-field validation, a honeypot, a sending state, duplicate-click prevention, a timeout, and an honest success/error response. A failed submission retains the typed message and offers Copy, with selectable text if clipboard access is blocked. The visitor's email is passed to Web3Forms for Reply-To. The form does not write visitor details to localStorage or put them in a URL.

The public Web3Forms key in the HTML is intended for frontend forms. It was copied from the owner's existing theaicomp.ng contact form; it is not a secret account token. Keep that account active. Its existing destination, domain restrictions and plan limits still apply. Preview hosts may need to be allowed if the account restricts domains. A provider success confirms acceptance; inbox delivery still needs a real submission checked by the owner.

## Update your laptop and GitHub

1. Open your existing website folder in your editor or GitHub Desktop. Back up or commit unfinished changes. Keep the existing `.git` directory.
2. On the correct production branch with a clean working tree, pull and create a branch:

   ```sh
   git switch main
   git pull --ff-only
   git switch -c website-redesign
   ```

3. Copy the contents of this package into that repository's website root: `public/`, `scripts/`, `tests/`, `package.json`, `vercel.json`, and this README. Merge `.gitignore` rules. Preserve unrelated files and local secrets. Review existing package files, lockfiles and Vercel routing config before overwriting them; GitHub source inspection is still needed for an exact file migration. If you previously copied the earlier export, remove its unused `api/contact.js`, `lib/contact-handler.mjs`, and `.env.example` on the branch. No Resend variables are used by this version.
4. Use Node.js 24, then run:

   ```sh
   npm install
   npm test
   npm run build
   npm run dev
   ```

   Open `http://localhost:3000`. Submitting its production form sends through the existing Web3Forms account. The automated tests mock the provider and do not send messages.
5. Review and commit intended changes, including the npm lockfile. Push `website-redesign`. Vercel normally creates a branch preview. Confirm the project Root Directory is the folder containing this package; the included configuration uses Framework Other, Build Command `npm run build`, and Output Directory `public`.
6. Review the preview and send a contact enquiry using your own details. Check the configured inbox/spam and confirm Reply-To. Merge into `main` only when ready to replace the live site. The existing Vercel project then serves the new site on the same domain.

A direct upload to Vercel does not update GitHub or your laptop. If such a preview/release is created, sync this exact code to the repository before making later production pushes, otherwise older repository code can replace it. When GitHub has been updated elsewhere, use `git pull --ff-only` in your clean local `main` branch afterward. Do not force push or re-initialize the repository.

## Editing and checks

- Content and inline illustrations: `public/index.html`.
- Styles: `public/assets/site.css` and `public/assets/one-page.css`.
- Form UI: `public/assets/site.js`; validation: `contact-message.mjs`; delivery: `contact-submit.mjs`.
- `npm test`: mocked success/rejection, payload filtering, required-field validation, honeypot, unavailable configuration, network failures, cancellation and Unicode.
- `npm run build`: checks assets, form delivery configuration, production metadata and canonical URL.
- Public export removes the private preview banner and permits indexing. The separate private ChatGPT Sites copy remains a review version with manual message preparation.

## References

- https://docs.web3forms.com/how-to-guides/html-and-javascript
- https://docs.web3forms.com/getting-started/api-reference
- https://vercel.com/docs/git/vercel-for-github
- https://vercel.com/docs/project-configuration/vercel-json
