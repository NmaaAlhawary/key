// Prefixes public files with the site base, so images work at / locally and at /key/ on GitHub Pages.
export const asset = p => import.meta.env.BASE_URL + p.replace(/^\//, '')
