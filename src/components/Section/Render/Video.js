import React, { useState, useEffect } from 'react';
import { FaCompress, FaExpand } from 'react-icons/fa';
import { LuVideo } from 'react-icons/lu';
import { twJoin, Media, Image, website, stripTags } from '../../_utils';

const youtubeRegex =
    /\b(?:https?:\/\/)?(?:(?:www|m)\.)?youtu(?:\.be\/|be\.com\/(?:watch(?:\?(?:(?:feature=player_embedded|app=desktop)&)?v=|\/)|v\/|oembed\?url=http%3A\/\/www\.youtube\.com\/watch\?v%3D|attribution_link\?a=[0-9A-Za-z\-_]{10,20}&u=(?:%2F|\/)watch%3Fv%3D|e(?:mbed)?\/|shorts\/)|be-nocookie\.com\/embed\/)([0-9A-Za-z\-_]{10,20})/;

const vimeoRegex =
    /(?:http|https)?:?\/?\/?(?:www\.)?(?:player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;

function getVideos(sections) {
    const videos = sections
        .map((section) => section.content?.content?.filter((object) => object.type === 'Video'))
        .filter(Boolean)
        .flat()
        .map((video) => video.attrs);

    return videos;
}

async function getVideoThumbnail(url) {
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        try {
            const response = await fetch(
                `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`
            );
            const data = await response.json();
            return data.thumbnail_url;
        } catch (error) {
            console.error('Failed to fetch Vimeo thumbnail:', error);
            return null;
        }
    }

    return null;
}

export default function Video({ page, videoControl, ...video }) {
    const profile = page.getPageProfile();
    const sections = page.blockGroups.body;
    const videos = getVideos(sections);

    let caption = video?.caption || '';
    caption = stripTags(caption);

    const [src, setSrc] = useState(video.src);
    const [currentVideo, setCurrentVideo] = useState(video);
    const [miniPlayer, setMiniPlayer] = useState(false);
    const [overlay, setOverlay] = useState(false);

    const resetVideo = () => {
        if (video.src !== currentVideo.src) {
            setCurrentVideo(video);
        }
    };

    const changeVideo = (newVideo) => {
        return () => {
            setCurrentVideo(newVideo);
        };
    };

    const toggleMiniPlayer = () => {
        setOverlay(false);
        if (miniPlayer) {
            resetVideo();
        }
        setMiniPlayer(!miniPlayer);
    };

    const toggleOverlay = () => {
        setMiniPlayer(false);
        if (overlay) {
            resetVideo();
        }
        setOverlay(!overlay);
    };

    const [ogThumbnail, setOgThumbnail] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnails, setThumbnails] = useState(Array(videos.length).fill(null));

    const playerClasses = twJoin(
        miniPlayer && 'fixed bottom-4 right-4 w-64 h-36 z-50',
        overlay && 'flex w-full max-w-6xl mx-auto bg-white shadow-lg'
    );

    const outerClasses = twJoin(
        !overlay && 'absolute inset-0 z-10',
        overlay && 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75'
    );

    useEffect(() => {
        async function fetchThumbnail() {
            const thumb = await getVideoThumbnail(video.src);
            setOgThumbnail(thumb);
        }
        fetchThumbnail();
    }, []);

    useEffect(() => {
        async function fetchThumbnail() {
            const thumb = await getVideoThumbnail(currentVideo.src);
            setThumbnail(thumb);
        }
        setSrc(currentVideo.src);
        fetchThumbnail();
    }, [currentVideo]);

    useEffect(() => {
        async function fetchThumbnails() {
            const array = await Promise.all(
                videos.map(async ({ src }) => {
                    const thumb = await getVideoThumbnail(src);
                    return thumb;
                })
            );
            setThumbnails(array);
        }
        fetchThumbnails();
    }, []);

    // prevent page scroll when overlay is active
    useEffect(() => {
        if (overlay) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }, [overlay]);

    const Buttons = () =>
        videoControl ? (
            <div className='flex space-x-4 mt-4'>
                <button
                    onClick={toggleMiniPlayer}
                    className='flex items-center px-4 py-2 rounded-lg'>
                    <FaCompress className='mr-2' />
                    <span className='text-sm md:text-base'>
                        {website.localize({
                            en: 'Mini Player',
                            es: 'Reproductor Mini'
                        })}
                    </span>
                </button>
                <button onClick={toggleOverlay} className='flex items-center px-4 py-2 rounded-lg'>
                    <FaExpand className='mr-2' />
                    <span className='text-sm md:text-base'>
                        {website.localize({
                            en: 'Overlay',
                            es: 'Superposición'
                        })}
                    </span>
                </button>
            </div>
        ) : null;

    const FakeBlock = () => (
        <Image
            className='relative z-0 flex-1 block m-0 aspect-video'
            {...{ profile, url: ogThumbnail }}
        />
    );

    return (
        <div className='not-prose mb-6 lg:my-8'>
            <div className='relative'>
                <div
                    className={outerClasses}
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            toggleOverlay();
                        }
                    }}>
                    <div className={playerClasses}>
                        {/* Main Video Area */}
                        <div className={`flex-1 block`}>
                            <Media
                                className='mt-0'
                                media={currentVideo}
                                {...(thumbnail && { thumbnail: { url: thumbnail } })}
                            />
                        </div>
                        {/* Thumbnail List */}
                        {overlay && (
                            <div className='w-1/4 py-2 lg:py-4 xl:py-5 bg-gray-800 flex items-center justify-center h-[calc(100vw*3/4*0.5625)] min-[1152px]:h-[calc(1152px*3/4*0.5625)]'>
                                <div className='grid grid-cols-1 px-2 lg:px-4 xl:px-5 gap-2 lg:gap-4 max-h-full overflow-y-auto'>
                                    {videos.map((video, index) => {
                                        const currentThumbnail = thumbnails[index];

                                        return (
                                            <div
                                                key={index}
                                                className={`w-full aspect-video cursor-pointer p-1.5 rounded-lg transition-transform transform hover:scale-105 ${
                                                    video === currentVideo ? 'border-2' : ''
                                                }`}
                                                onClick={changeVideo(video)}>
                                                {currentThumbnail ? (
                                                    <Image
                                                        className='w-full h-full object-cover rounded-md'
                                                        {...{ profile, url: currentThumbnail }}
                                                    />
                                                ) : (
                                                    <div className='w-full h-full flex items-center justify-center bg-slate-600 rounded-md'>
                                                        <LuVideo className='text-slate-300 w-8 h-8' />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {/* Additional Buttons */}
                        {/* {overlay && (
                            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2'>
                                <Buttons />
                            </div>
                        )} */}
                    </div>
                    {caption ? (
                        <div className='block outline-none text-primary-80 border-none text-sm text-center mt-1'>
                            {caption}
                        </div>
                    ) : null}
                </div>
                {/* Conditional Rendering of FakeBlock and Buttons */}
                {<FakeBlock />}
            </div>
            {!overlay && <Buttons />}
        </div>
    );
}
