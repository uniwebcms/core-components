import Link from '../Link';
import Image from '../Image';
import Asset from '../Asset';
import FileLogo from '../FileLogo';
import Media from '../Media';
import { twJoin, twMerge } from 'tailwind-merge';

const stripTags = (htmlString) => {
    if (!htmlString || typeof htmlString !== 'string') return '';

    // Remove HTML tags using regular expression
    const plainString = htmlString.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    const decodedString = new DOMParser().parseFromString(plainString, 'text/html').body
        .textContent;

    return decodedString;
};

const px = (classNames) => {
    return classNames
        .split(' ')
        .map((className) => {
            // Skip if already prefixed or is a module class
            if (className.startsWith('tw-') || className.includes('.')) {
                return className;
            }

            // Handle arbitrary values with square brackets
            if (className.includes('[') && className.includes(']')) {
                if (className.includes(':')) {
                    // Handle responsive arbitrary values
                    const [screen, ...rest] = className.split(':');
                    const baseClass = rest.join(':');
                    return `${screen}:tw-${baseClass}`;
                }
                return `tw-${className}`;
            }

            // Handle responsive variants with negative values
            if (className.includes(':')) {
                const [screen, ...rest] = className.split(':');
                const baseClass = rest.join(':');
                if (baseClass.startsWith('-')) {
                    return `${screen}:-tw-${baseClass.slice(1)}`;
                }
                return `${screen}:tw-${baseClass}`;
            }

            // Handle negative values in non-responsive classes
            if (className.startsWith('-')) {
                return `-tw-${className.slice(1)}`;
            }

            return `tw-${className}`;
        })
        .join(' ');
};

const website = uniweb.activeWebsite;
const Profile = uniweb.Profile;
export { Profile, website, stripTags, px };

// React components
// export { , Image, Asset, Icon, SafeHtml, FileLogo, MediaIcon, Pages, Media, Disclaimer };
export { Link, Media, Image, Asset, FileLogo };

// Third-party utilities
export { twJoin, twMerge };
