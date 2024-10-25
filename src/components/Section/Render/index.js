import { twJoin, stripTags } from '../../_utils';
import React from 'react';
import Divider from './Divider';
import Video from './Video';
import Image from './Image';
import Warning from './Warning';
import Card from './Card';
import Code from './Code';
import Math from './Math';

const Render = function (props) {
    const { block, content, page } = props;

    const blockId = block.id;
    const { video_control: videoControl = false } = block.getBlockProperties();

    if (!content || !content.length) return null;

    return content.map((block, index) => {
        const { type, content, alignment } = block;

        switch (type) {
            case 'paragraph':
                return (
                    <p
                        key={index}
                        dangerouslySetInnerHTML={{ __html: content }}
                        style={{ textAlign: alignment }}></p>
                );
            case 'heading':
                const { level } = block;
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
                return <Video key={index} {...block} page={page} videoControl={videoControl} />;
            case 'warning':
                return <Warning key={index} {...block} />;
            case 'divider':
                return <Divider key={index} {...block} />;
            case 'orderedList':
                return (
                    <ol key={index}>
                        {content.map((item, i) => {
                            return (
                                <li key={i}>
                                    <Render content={item} />
                                </li>
                            );
                        })}
                    </ol>
                );
            case 'bulletList':
                return (
                    <ul key={index}>
                        {content.map((item, i) => {
                            return (
                                <li key={i}>
                                    <Render content={item} />
                                </li>
                            );
                        })}
                    </ul>
                );
            case 'blockquote':
                return (
                    <blockquote key={index}>
                        <Render content={content} />
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
        }
    });
};

export default Render;
