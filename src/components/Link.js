/**
 * Wrapper that links to a Profile or custom href.
 * @module Link
 */

import React from 'react';
const website = uniweb.activeWebsite;

const { Link } = website.getRoutingComponents();

// Check if the href is a file link
const fileExtensions = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'jpg',
    'svg',
    'jpeg',
    'png',
    'webp',
    'gif',
    'mp4',
    'mp3',
    'wav',
    'mov',
    'zip'
];

function isFileLink(href) {
    try {
        const url = new URL(href, window.location.origin); // Handle relative URLs
        const extension = url.pathname.split('.').pop().toLowerCase();
        return fileExtensions.includes(extension);
    } catch (error) {
        return false; // Invalid URL
    }
}

function isMediaLink(href) {
    const patterns = {
        twitter: 'https://twitter.com',
        facebook: 'https://www.facebook.com',
        linkedin: 'https://www.linkedin.com',
        medium: 'https://medium.com',
        quora: 'https://www.quora.com',
        tumblr: 'https://www.tumblr.com',
        youtube: 'https://www.youtube.com',
        github: 'https://github.com',
        x: 'https://x.com',
        instagram: 'https://www.instagram.com'
    };

    if (!href) return false;

    const lowercasedHref = href.toLowerCase();

    for (const platform in patterns) {
        if (lowercasedHref.startsWith(patterns[platform])) {
            return platform;
        }
    }

    return false;
}

function getMediaLinkLabel(type) {
    const map = {
        twitter: 'Twitter',
        facebook: 'Facebook',
        linkedin: 'LinkedIn',
        medium: 'Medium',
        quora: 'Quora',
        tumblr: 'Tumblr',
        youtube: 'YouTube',
        github: 'GitHub',
        x: 'X',
        instagram: 'Instagram'
    };

    return map[type] || type;
}

function generateGenericTitle(href) {
    if (!href) return null;

    const url = new URL(href, window.location.origin); // handles relative URLs too
    const isExternal = url.origin !== window.location.origin;

    // Decode and humanize the path
    let humanPath = decodeURIComponent(url.pathname)
        .replace(/^\/+/, '') // Remove leading slashes
        .replace(/[-_]/g, ' ') // Optional: make it more readable
        .replace(/\.\w+$/, '') // Optional: remove file extensions like .html, .pdf
        .trim();

    // If the path is empty (e.g., just "/"), fallback to full URL
    if (!humanPath) {
        humanPath = href;
    }

    if (isExternal) {
        return website.localize({
            en: `Open external link: ${humanPath}`,
            fr: `Ouvrir le lien externe : ${humanPath}`,
            es: `Abrir enlace externo: ${humanPath}`,
            zh: `打开外部链接：${humanPath}`
        });
    }

    return website.localize({
        en: `Go to ${humanPath}`,
        fr: `Aller à ${humanPath}`,
        es: `Ir a ${humanPath}`,
        zh: `前往 ${humanPath}`
    });
}

/**
 * Create a React DOM router Link that wraps content that functions as a
 * link to a given target page.
 *
 * @example
 * function MyComponent() {
 *   return (
 *      <Link to='https:...' className='xxx'>
 *          <span>A link</span>
 *      </Link>
 *   );
 * }
 *
 * @component Link
 * @prop {Profile?} profile - The target profile if the link points to a profile.
 * @prop {Object?} [options] - Options to control the destination on a profile.
 * @prop {string?} options.tab - The target tab of a profile.
 * @prop {string?} options.mode - The target mode of a profile. Defaults to 'view'.
 * @prop {string?} options.searchParams - Extra arguments for the profile HREF.
 * @prop {string?} [target] - A `target` attribute for the anchor element.
 * @prop {string?} title - A `title` attribute for the anchor element.
 * @prop {string|Profile} style - A `style` attribute for the anchor element.
 * @prop {string?} className - A `className` attribute for the anchor element.
 * @prop {string?} to - An `href` attribute for the anchor element.
 * @prop {string?} href - Another acceptable `href` attribute for the anchor element.
 * @prop {string?} ariaLabel - An ARIA label for the anchor element.
 * @prop {ReactNode|ReactNodeArray} children - The contents for the Link container.
 * @returns {function} A Link component.
 */
export default function ({ to, href, title, ...props }) {
    const linkHref = href || to;

    // Check if the extracted extension matches any known file extensions
    if (isFileLink(linkHref)) {
        // return `<a href=${linkHref} target='_blank' download onclick="event.preventDefault(); uniweb.downloadFile('${linkHref}');return false;">${props.children}</a>`;

        return (
            <a
                href={linkHref}
                target='_blank'
                download
                onClick={(e) => {
                    e.preventDefault();
                    uniweb.downloadFile(linkHref);
                    return false;
                }}
                title={website.localize({
                    en: 'Download file',
                    fr: 'Télécharger le fichier',
                    es: 'Descargar archivo',
                    zh: '下载文件'
                })}
                aria-label={'Download file'}>
                {props.children}
            </a>
        );
    }

    if (title) {
        return <Link to={linkHref} title={title} {...props} />;
    } else {
        // a generic way to generate link title
        const mediaType = isMediaLink(linkHref);

        if (mediaType) {
            const mediaLabel = getMediaLinkLabel(mediaType);
            title = website.localize({
                en: `View on ${mediaLabel}`,
                fr: `Voir sur ${mediaLabel}`,
                es: `Ver en ${mediaLabel}`,
                zh: `在 ${mediaLabel} 上查看`
            });
        } else if (linkHref.startsWith('mailto:')) {
            const email = linkHref.replace('mailto:', '');
            title = website.localize({
                en: `Send an email to ${email}`,
                fr: `Envoyer un e-mail à ${email}`,
                es: `Enviar un correo electrónico a ${email}`,
                zh: `发送电子邮件到 ${email}`
            });
        } else if (linkHref.startsWith('tel:')) {
            const phone = linkHref.replace('tel:', '');
            title = website.localize({
                en: `Call ${phone}`,
                fr: `Appeler ${phone}`,
                es: `Llamar a ${phone}`,
                zh: `拨打电话 ${phone}`
            });
        } else {
            title = generateGenericTitle(linkHref);
        }

        return (
            <Link to={linkHref} title={title} {...props}>
                {props.children}
            </Link>
        );
    }
}
