import React, { useState } from 'react';
import styles from '../Section.module.scss';
import { Image, website } from '../../_utils';

const imageCaptionStyle = `block outline-none border-none text-gray-500 text-sm text-center ${styles.ImageCaption}}`;

export default function ImageBlock(props) {
    const { url, caption, direction, filter, info, targetId, aspect_ratio, page, href } = props;

    if (targetId) info.contentId = targetId;

    let { ratio } = aspect_ratio;

    let maxWidth = 'none',
        maxHeight,
        body;

    const [imgRatio] = useState(aspect_ratio);

    let imgFilter = '';
    let wrapperStyle = {};

    if (filter && Object.keys(filter).length > 0) {
        // let filterStyle = {
        //     filter: `
        //         blur(${filter?.blur || 0}px)
        //         brightness(${filter?.brightness || 100}%)
        //         contrast(${filter?.contrast || 100}%)
        //         grayscale(${filter?.grayscale || 0}%)
        //         saturate(${filter?.saturate || 100}%)
        //         sepia(${filter?.sepia || 0}%)
        //     `
        // };
        // imgFilter = css({
        //     '& img': filterStyle
        // });
        wrapperStyle['--f-blur'] = `${filter?.blur || 0}px`;
        wrapperStyle['--f-bright'] = `${filter?.brightness || 100}%`;
        wrapperStyle['--f-contrast'] = `${filter?.contrast || 100}%`;
        wrapperStyle['--f-gray'] = `${filter?.grayscale || 0}%`;
        wrapperStyle['--f-sat'] = `${filter?.saturate || 100}%`;
        wrapperStyle['--f-sepia'] = `${filter?.sepia || 0}%`;
    }

    const { identifier } = info;

    let imgProps = identifier ? { value: identifier } : { url: url };

    if (href) {
        imgProps = {
            ...imgProps,
            href,
            website
        };
    }

    const inner = (
        <>
            <div
                className={`relative w-full mx-auto block ${styles.ImageWrapper}`}
                style={{
                    maxHeight,
                    maxWidth,
                    ...wrapperStyle
                }}
            >
                <div
                    className="aspect-ratio-fill"
                    style={{
                        paddingBottom: imgRatio?.pb || `${imgRatio.ratio}%`
                    }}
                />
                <Image
                    profile={page.getPageProfile()}
                    {...imgProps}
                    className={`not-prose absolute top-0 left-0 w-full h-auto block ${imgFilter}`}
                ></Image>
            </div>

            <figcaption className={`text-center! mt-2.5 tracking-normal text-sm outline-none z-50`}>
                {caption ? <div className={`${imageCaptionStyle}`}>{caption}</div> : null}
            </figcaption>
        </>
    );

    if (direction === 'small') {
        body = (
            <figure
                className={`relative clear-both outline-none z-10 mt-10 mx-auto ${styles.ImageWrapper}`}
            >
                <div
                    className={`relative w-full mx-auto flex justify-center ${imgFilter}`}
                    style={{
                        maxWidth: '896px',
                        ...wrapperStyle
                    }}
                >
                    <Image
                        profile={page.getPageProfile()}
                        {...imgProps}
                        className={`not-prose block max-h-[120px] w-auto`}
                    ></Image>
                </div>

                <figcaption
                    className={`text-center! mt-2.5 tracking-normal text-sm outline-none z-50`}
                >
                    {caption ? <div className={`${imageCaptionStyle}`}>{caption}</div> : null}
                </figcaption>
            </figure>
        );
    } else if (direction === 'left' || direction === 'right') {
        maxWidth = 525;
        maxHeight = (maxWidth * ratio) / 100;

        maxWidth = `${maxWidth}px`;
        maxHeight = `${maxHeight}px`;

        const marginStyle =
            direction === 'left' ? 'ml-[-150px] mr-[30px]' : 'mr-[-150px] ml-[30px]';

        body = (
            <figure
                className={`relative clear-both outline-none z-10 mt-8 mx-auto`}
                style={{
                    maxWidth: '896px'
                }}
            >
                <div
                    className={`md:w-3/4  ${
                        direction === 'left' ? 'fload-left' : 'float-right'
                    } relative mb-6 ${marginStyle}`}
                >
                    {inner}
                </div>
            </figure>
        );
    } else {
        if (direction === 'fill') {
            maxWidth = 'none';
            maxHeight = 'none';
        } else {
            if (direction === 'center') {
                maxWidth = 896;
            } else if (direction === 'wide') {
                maxWidth = 1280;
            }

            maxHeight = (maxWidth * ratio) / 100;
            maxHeight = `${maxHeight}px`;
            maxWidth = `${maxWidth}px`;
        }

        body = (
            <figure
                className={`relative clear-both outline-none z-10 mt-10 mx-auto`}
                style={{
                    maxWidth,
                    maxHeight
                }}
            >
                {inner}
            </figure>
        );
    }

    return body;
}
