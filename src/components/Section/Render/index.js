import { twJoin, stripTags } from '../../_utils';
import React from 'react';
import Divider from './Divider';
import Video from './Video';
import Image from './Image';
import Warning from './Warning';
import Card from './Card';
import Document from './Document';
import Code from './Code';
import Math from './Math';
import Table from './Table';
import Details from './Details';

/**
 * Font size for each predefined text size, in `em` so a block tracks the
 * surrounding `prose` scale (prose-base -> prose-2xl) instead of fighting it,
 * and so the `em`-based prose margins tighten proportionally with it.
 *
 * Applied as an inline style rather than a utility class on purpose. This
 * library's CSS is scoped to `.tw-core-component` by postcss-prefix-selector,
 * but consuming modules render our output in their own wrappers too (A1's
 * Article, for one), where such a rule would silently not match. An inline
 * style is wrapper-independent, and it is already how `textAlign` is applied
 * a few lines below.
 */
const TEXT_SIZE_STYLE = {
    small: '0.8em'
};

/**
 * `em` sizing compounds when applied twice down one branch - a small list item
 * holding a small paragraph would render at 0.64em. Each nested Render is told
 * the size already applied above it, and a block only emits a size when it
 * actually changes it.
 */
const textSizeStyle = (size, inherited) =>
    (size && size !== inherited && TEXT_SIZE_STYLE[size]) || undefined;

const Render = function (props) {
    const { block: pageBlock, content, page, inheritedTextSize = null } = props;

    if (!content || !content.length) return null;

    return content.map((block, index) => {
        const { type, content, alignment } = block;

        switch (type) {
            case 'paragraph':
                return (
                    <p
                        key={index}
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{
                            textAlign: alignment,
                            fontSize: textSizeStyle(block.textSize, inheritedTextSize)
                        }}></p>
                );
            case 'heading':
                const { level } = block;
                const blockId = pageBlock?.id || '';
                const Heading = `h${level}`;

                return (
                    <Heading
                        key={index}
                        id={`Section${blockId}-${stripTags(content).replace(/\s/g, '-')}`}
                        style={{ textAlign: alignment }}
                        dangerouslySetInnerHTML={{ __html: content }}></Heading>
                );
            case 'image':
                return <Image key={index} {...block} page={page} />;
            case 'video':
                const { video_control: videoControl = false } = pageBlock.getBlockProperties();
                return <Video key={index} {...block} page={page} videoControl={videoControl} />;
            case 'warning':
                return <Warning key={index} {...block} />;
            case 'divider':
                return <Divider key={index} {...block} />;
            case 'orderedList':
                return (
                    <ol key={index} className='list-decimal pl-5'>
                        {content.map((item, i) => {
                            const itemSize = block.itemTextSizes?.[i] || null;

                            return (
                                <li
                                    key={i}
                                    style={{
                                        fontSize: textSizeStyle(itemSize, inheritedTextSize)
                                    }}>
                                    <Render
                                        content={item}
                                        inheritedTextSize={itemSize || inheritedTextSize}
                                    />
                                </li>
                            );
                        })}
                    </ol>
                );
            case 'bulletList':
                return (
                    <ul key={index} className='list-disc pl-5'>
                        {content.map((item, i) => {
                            const itemSize = block.itemTextSizes?.[i] || null;

                            return (
                                <li
                                    key={i}
                                    style={{
                                        fontSize: textSizeStyle(itemSize, inheritedTextSize)
                                    }}>
                                    <Render
                                        content={item}
                                        inheritedTextSize={itemSize || inheritedTextSize}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                );
            case 'blockquote':
                return (
                    <blockquote key={index}>
                        <Render content={content} inheritedTextSize={inheritedTextSize} />
                    </blockquote>
                );

            case 'codeBlock':
                return <Code key={index} {...block} />;
            case 'card-group': {
                return (
                    <div key={index} className={'flex flex-wrap gap-6'}>
                        {content.map((c, i) => (
                            <Card key={`c_${i}`} {...c.attrs}></Card>
                        ))}
                    </div>
                );
            }
            case 'document-group':
                return (
                    <div key={index} className={'flex flex-wrap gap-6'}>
                        {content.map((c, i) => (
                            <Document key={`c_${i}`} {...c.attrs} type='document'></Document>
                        ))}
                    </div>
                );
            case 'math_display':
                return <Math key={index} {...block} />;
            case 'button':
                const { style } = block.attrs;

                return (
                    <div key={index} className='mb-3 lg:mb-4'>
                        <button
                            type='button'
                            className={twJoin(
                                style === 'secondary' ? 'btn-secondary' : '',
                                'px-2.5 py-1 lg:px-4 lg:py-2 border text-base lg:text-lg'
                            )}
                            dangerouslySetInnerHTML={{ __html: content }}></button>
                    </div>
                );
            case 'table':
                return <Table key={index} {...block} />;
            case 'details': {
                return <Details key={index} {...block} />;
            }
            default:
                return null;
        }
    });
};

export default Render;
