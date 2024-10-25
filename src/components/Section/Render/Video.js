import React, { useState, useEffect } from 'react';
import { FaCompress, FaExpand } from 'react-icons/fa';
import { twJoin, Media, Image, website } from '../../_utils';

const youtubeRegex =
    /\b(?:https?:\/\/)?(?:(?:www|m)\.)?youtu(?:\.be\/|be\.com\/(?:watch(?:\?(?:(?:feature=player_embedded|app=desktop)&)?v=|\/)|v\/|oembed\?url=http%3A\/\/www\.youtube\.com\/watch\?v%3D|attribution_link\?a=[0-9A-Za-z\-_]{10,20}&u=(?:%2F|\/)watch%3Fv%3D|e(?:mbed)?\/|shorts\/)|be-nocookie\.com\/embed\/)([0-9A-Za-z\-_]{10,20})/;

const vimeoRegex =
    /(?:http|https)?:?\/?\/?(?:www\.)?(?:player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|video\/|)(\d+)(?:|\/\?)/;

function getVideos(sections) {
    const videos = sections
        .map((section) => section.content.content?.filter((object) => object.type === 'Video'))
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

    const Buttons = () =>
        videoControl ? (
            <div className='flex gap-x-4 mt-4'>
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
        <Image className='relative z-0 flex-1 block m-0' {...{ profile, url: ogThumbnail }} />
    );

    return (
        <div className='not-prose mb-6 lg:my-8'>
            <div className='relative'>
                <div
                    style={{
                        inset: 0,
                        backgroundColor: overlay ? 'rgba(0, 0, 0, 0.8)' : 'unset'
                    }}
                    className={twJoin(
                        overlay ? 'fixed z-50 flex items-center justify-center' : 'absolute z-10'
                    )}
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            toggleOverlay();
                        }
                    }}>
                    <div
                        style={{
                            backgroundColor: overlay ? 'white' : 'unset'
                        }}
                        className={twJoin(
                            miniPlayer && 'fixed bottom-4 right-4 w-64 h-36 z-50',
                            overlay && 'flex w-full max-w-6xl mx-auto shadow-lg'
                        )}>
                        {/* Main Video Area */}
                        <div className={`flex-1 block`}>
                            <Media
                                className='mt-0'
                                media={currentVideo}
                                {...(thumbnail && { thumbnail: { url: thumbnail } })}
                            />
                        </div>
                        {/* Thumbnail Grid */}
                        {overlay && (
                            <div className='w-1/4 p-4 overflow-y-auto bg-gray-800 flex items-center justify-center'>
                                <div className='grid grid-cols-1 gap-4'>
                                    {videos.map((video, index) => {
                                        const currentThumbnail = thumbnails[index];
                                        return (
                                            <div
                                                key={index}
                                                className={`cursor-pointer p-2 rounded-lg transition-transform transform hover:scale-105 ${
                                                    video === currentVideo
                                                        ? 'border-2 border-indigo-500'
                                                        : ''
                                                }`}
                                                onClick={changeVideo(video)}>
                                                <Image
                                                    className='w-full h-auto object-contain rounded-md m-2'
                                                    {...{ profile, url: currentThumbnail }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                        {/* Additional Buttons */}
                        {overlay && (
                            <div className='absolute bottom-4 left-0 w-full flex items-center justify-center'>
                                <Buttons />
                            </div>
                        )}
                    </div>
                </div>
                {/* Conditional Rendering of FakeBlock and Buttons */}
                {<FakeBlock />}
            </div>
            {!overlay && <Buttons />}
        </div>
    );
}
