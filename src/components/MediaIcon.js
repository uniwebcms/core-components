/**
 * Render a social media icon
 * @module MediaIcon
 */

import React from 'react';
import {
    SiAcademia,
    SiMedium,
    SiMendeley,
    SiOrcid,
    SiLinkedin,
    SiPinterest,
    SiFacebook,
    SiYoutube,
    SiGithub,
    SiInstagram
} from 'react-icons/si';
import { FaResearchgate, FaTumblrSquare, FaQuora, FaGooglePlus } from 'react-icons/fa';
import { HiMiniPhone } from 'react-icons/hi2';
import { IoIosLink } from 'react-icons/io';
import { AiOutlineMail } from 'react-icons/ai';
import { RiTwitterXFill } from 'react-icons/ri';
import { twMerge } from 'tailwind-merge';

/**
 * Return a Icon based on the social media type.
 *
 * @example
 * function MyComponent() {
 *   return (
 *       <MediaIcon type={'facebook'} size="10" />
 *   );
 * }
 *
 * @component MediaIcon
 * @prop {string} type - The media type.
 * @prop {string} size - The size of the icon.
 * @prop {string} className - Additional tailwind className.
 * @returns {function} A react component.
 */

export default function MediaIcon({ type, size = '8', className = '' }) {
    const map = {
        academia_edu: SiAcademia,
        facebook: SiFacebook,
        google_plus: FaGooglePlus,
        linkedin: SiLinkedin,
        medium: SiMedium,
        mendeley: SiMendeley,
        orcid_page: SiOrcid,
        pinterest: SiPinterest,
        quora: FaQuora,
        researchgate: FaResearchgate,
        tumblr: FaTumblrSquare,
        twitter: RiTwitterXFill,
        youtube: SiYoutube,
        github: SiGithub,
        x: RiTwitterXFill,
        instagram: SiInstagram
    };

    let Icon = IoIosLink;

    if (type === 'email') {
        Icon = AiOutlineMail;
    } else if (type === 'phone') {
        Icon = HiMiniPhone;
    } else if (map[type]) {
        Icon = map[type];
    }

    return <Icon className={twMerge(`w-${size} h-${size}`, className)} />;
}
