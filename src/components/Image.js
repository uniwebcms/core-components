/**
 * Render the avatar, banner or other asset of a profile.
 * @module Image
 */

import React from 'react';
import { twMerge } from 'tailwind-merge';
import Link from './Link';

const website = uniweb.activeWebsite;

/**
 * Resolve the image sources for a profile banner or avatar.
 * The optimized (webp) url is preferred; the original upload is kept as fallback.
 */
function getProfileImageSources(profile, type, size) {
    const { url, alt, fallback } = profile.getImageInfo(type, size);

    // Older runtimes do not return `fallback`; the 'original' size always maps to the base file.
    const baseUrl = fallback || profile.getImageInfo(type, 'original')?.url || '';

    if (baseUrl && baseUrl !== url) {
        return { src: baseUrl, optSrc: url, alt };
    }

    return { src: url, optSrc: null, alt };
}

function getAssetImageSources(profile, value, imgURL, altText) {
    if (imgURL && !value) {
        return { src: imgURL, optSrc: null, alt: altText };
    }

    const { src, alt, optSrc } = profile.getAssetInfo(value, true, altText);

    return { src, optSrc: optSrc && optSrc !== src ? optSrc : null, alt };
}

function buildFilterStyle(filter) {
    return {
        filter: `
            blur(${filter?.blur || 0}px)
            brightness(${filter?.brightness || 100}%)
            contrast(${filter?.contrast || 100}%)
            grayscale(${filter?.grayscale || 0}%)
            saturate(${filter?.saturate || 100}%)
            sepia(${filter?.sepia || 0}%)
        `
    };
}

/**
 * Create a image with given profile and type.
 *
 * @example
 * function MyComponent() {
 *   return (
 *       <Image profile={profile} type="banner" size="sm" rounded className="hover:cursor-pointer">
 *			{label}
 *		 </Image>
 *   );
 * }
 *
 * @component Asset
 * @prop {Profile} profile - The target profile.
 * @prop {string} type - One of the following: 'avatar', 'banner' or 'image'.
 * @prop {string} size - One of the following: 'xs', 'sm', 'md', 'lg'.
 * @prop {string|bool} [rounded=false] - true for 'rounded-full' or a specific class name.
 * @prop {string} className - Additional tailwind class names.
 * @prop {string} value - The value of the asset when type is not 'avatar' or 'banner'.
 * @prop {string} src - Another option of the value of the asset when type is not 'avatar' or 'banner'.
 * @prop {string} href - The href of the asset, make it clickable.
 * @prop {string} alt - The alt of the asset when type is not 'avatar' or 'banner'.
 * @prop {bool} [ariaHidden=false] - True for 'aria-hidden="true"'.
 * @prop {string} [loading="lazy"] - The React loading type used.
 * @returns {function} A react component.
 */
export default function (props) {
    const {
        profile,
        type,
        size,
        rounded,
        className = '',
        value: imgVal,
        src: imgSrc,
        alt: altText,
        url: imgURL,
        customStyle = false,
        ariaHidden = false,
        loading = 'lazy',
        filter = null,
        href = null
    } = props;

    const value = imgSrc || imgVal;

    const { src, optSrc, alt } =
        type === 'banner' || type === 'avatar'
            ? getProfileImageSources(profile, type, size)
            : getAssetImageSources(profile, value, imgURL, altText);

    // When the optimized version fails to load, fall back to the original upload.
    const [failedOptSrc, setFailedOptSrc] = React.useState(null);
    const useFallback = Boolean(optSrc) && failedOptSrc === optSrc;

    const roundClassName = rounded ? (rounded === true ? 'rounded-full' : rounded) : '';

    const filterStyle = filter && Object.keys(filter).length > 0 ? buildFilterStyle(filter) : null;

    const style =
        props.style || filterStyle ? { ...(props.style || {}), ...(filterStyle || {}) } : null;

    const imgProps = {
        src: optSrc && !useFallback ? optSrc : src,
        alt,
        loading,
        'aria-hidden': ariaHidden,
        className: twMerge(
            customStyle ? '' : 'w-full h-full object-cover',
            roundClassName,
            className
        ),
        ...(optSrc && !useFallback ? { onError: () => setFailedOptSrc(optSrc) } : {}),
        ...(style ? { style } : {})
    };

    const body = <img {...imgProps} />;

    return href ? <Link to={website.makeHref(href)}>{body}</Link> : body;
}
