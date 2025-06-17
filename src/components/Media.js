import React, { useState, useRef, useEffect } from 'react';
import Image from './Image';
import { twMerge } from 'tailwind-merge';
import { BiPlay } from 'react-icons/bi';

// A helper function to load the YouTube API script without loading it multiple times.
const loadYouTubeAPI = (() => {
    let promise = null;
    return () => {
        if (!promise) {
            promise = new Promise((resolve, reject) => {
                // <-- Add reject
                if (window.YT && window.YT.Player) {
                    return resolve(window.YT); // <-- Pass YT object
                }
                const script = document.createElement('script');
                script.src = 'https://www.youtube.com/iframe_api';
                window.onYouTubeIframeAPIReady = () => resolve(window.YT);
                // Add this error handler
                script.onerror = () =>
                    reject(new Error('Failed to load YouTube API. Check for ad blockers.'));
                document.body.appendChild(script);
            });
        }
        return promise;
    };
})();

const loadVimeoAPI = (() => {
    let promise = null;
    return () => {
        if (!promise) {
            promise = new Promise((resolve, reject) => {
                if (window.Vimeo && window.Vimeo.Player) {
                    return resolve(window.Vimeo);
                }
                const script = document.createElement('script');
                script.src = 'https://player.vimeo.com/api/player.js';
                script.onload = () => resolve(window.Vimeo);
                script.onerror = () =>
                    reject(new Error('Failed to load the Vimeo Player API script.'));
                document.body.appendChild(script);
            });
        }
        return promise;
    };
})();

const ExternalVideo = ({
    profile,
    media,
    className = '',
    style,
    asBg = false,
    thumbnail,
    block
}) => {
    const { src, caption } = media;
    const iframeRef = useRef(null);
    const playerRef = useRef(null); // To hold the YouTube player instance
    const trackingRef = useRef({ hasPlayed: false, milestones: {} });

    const isYouTube = src.includes('youtube') || src.includes('youtu.be');
    const isVimeo = src.includes('vimeo');
    console.log(src);
    const urlParams = new URLSearchParams(src.split('?')[1] || '');

    if (isYouTube) {
        urlParams.set('enablejsapi', '1');
        urlParams.set('origin', window.location.origin);
        urlParams.set('mute', '1');

        if (asBg) {
            urlParams.set('autoplay', '1');
            urlParams.set('controls', '0');
            urlParams.set('loop', '1');
            // YouTube loop requires a playlist. The video ID is used as the playlist.
            const videoId = new URL(src).searchParams.get('v');
            if (videoId) {
                urlParams.set('playlist', videoId);
            }
        } else if (thumbnail) {
            urlParams.set('autoplay', '1');
        }
    } // Corrected version
    else if (isVimeo) {
        urlParams.set('api', '1');
        if (asBg) {
            urlParams.set('background', '1');
        }
        if (thumbnail) {
            urlParams.set('autoplay', '1');
        }
    }

    const videoSrc = `${src.split('?')[0]}?${urlParams.toString()}`;

    const allow = isYouTube
        ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        : 'autoplay; fullscreen; picture-in-picture';

    useEffect(() => {
        const iframe = iframeRef.current;

        if (!iframe || !block || !block.trackEvent) return;

        // Reset tracking state if the video source changes.
        trackingRef.current = { hasPlayed: false, milestones: {} };

        const handleProgress = (progressPercentage) => {
            [25, 50, 75, 95].forEach((milestone) => {
                if (progressPercentage >= milestone && !trackingRef.current.milestones[milestone]) {
                    trackingRef.current.milestones[milestone] = true;
                    const eventName =
                        milestone === 95 ? 'video_ended' : `video_milestone_${milestone}`;

                    console.log(eventName, videoSrc, `${milestone}%`);
                    block.trackEvent(eventName, {
                        milestone: `${milestone}%`,
                        video_src: videoSrc
                    });
                }
            });
        };

        let progressTimer;

        // --- YOUTUBE LOGIC ---
        if (isYouTube) {
            loadYouTubeAPI().then(() => {
                console.log('YouTube API loaded');
                if (!iframeRef.current) return; // Component might have unmounted while API was loading

                playerRef.current = new window.YT.Player(iframe, {
                    events: {
                        onStateChange: (event) => {
                            const player = event.target;

                            // State: PLAYING
                            if (event.data === window.YT.PlayerState.PLAYING) {
                                // 1. Track "Play" event (once)
                                if (!trackingRef.current.hasPlayed) {
                                    trackingRef.current.hasPlayed = true;

                                    // block.trackEvent('video_play', getImpressionData());
                                    console.log('video_play', videoSrc);
                                    block.trackEvent(`video_play`, { video_src: videoSrc });
                                }
                                // 2. Start checking for milestones
                                progressTimer = setInterval(() => {
                                    const progress =
                                        (player.getCurrentTime() / player.getDuration()) * 100;
                                    handleProgress(progress); // <-- Use the helper
                                }, 1000);
                            } else {
                                // State: PAUSED, BUFFERING, ENDED, etc.
                                // Stop checking for progress to avoid issues.
                                clearInterval(progressTimer);
                            }

                            // 4. Fallback for "Ended" event
                            if (event.data === window.YT.PlayerState.ENDED) {
                                if (!trackingRef.current.milestones[95]) {
                                    trackingRef.current.milestones[95] = true;

                                    block.trackEvent(`video_ended`, { video_src: videoSrc });
                                }
                            }
                        }
                    }
                });
            });
        } else if (isVimeo) {
            loadVimeoAPI()
                .then(() => {
                    if (!iframeRef.current) return;
                    console.log('Vimeo API loaded');
                    const player = new window.Vimeo.Player(iframe);
                    playerRef.current = player;

                    player.on('play', () => {
                        if (!trackingRef.current.hasPlayed) {
                            console.log('video_play', videoSrc);
                            trackingRef.current.hasPlayed = true;
                            block.trackEvent(`video_play`, { video_src: videoSrc });
                        }
                    });

                    player.on('timeupdate', (data) => {
                        handleProgress(data.percent * 100); // <-- Use the helper
                    });

                    player.on('ended', () => {
                        if (!trackingRef.current.milestones[95]) {
                            trackingRef.current.milestones[95] = true;
                            block.trackEvent(`video_ended`, { video_src: videoSrc });
                        }
                    });
                })
                .catch(console.error);
        }

        // Cleanup function: runs when the component unmounts or `src` changes
        return () => {
            clearInterval(progressTimer); // This is safe; it does nothing if progressTimer is not set
            if (playerRef.current && typeof playerRef.current.destroy === 'function') {
                playerRef.current.destroy();
            }
        };
    }, [videoSrc, block, isYouTube, isVimeo]);

    const frame = (
        <iframe
            ref={iframeRef}
            className={twMerge('absolute inset-0 w-full h-full', className)}
            src={videoSrc}
            title={caption}
            allow={allow}
            allowFullScreen
        ></iframe>
    );

    if (isYouTube || isVimeo) {
        return asBg ? (
            <div>{frame}</div>
        ) : (
            <div className={twMerge('relative')} style={style ?? { paddingBottom: '56.25%' }}>
                {thumbnail ? (
                    <FacadeVideo profile={profile} thumbnail={thumbnail} className={className}>
                        {frame}
                    </FacadeVideo>
                ) : (
                    frame
                )}
            </div>
        );
    } else {
        console.log('Unsupported media type, expected YouTube or Vimeo.');
        return null;
    }
};

export default function Media(props) {
    const { profile, media, className = '', style, asBg = false, thumbnail, block } = props;

    if (!media) return null;

    if (media.hasOwnProperty('imgPos')) {
        const { value, alt, url, href } = media;

        return <Image className={className} {...{ profile, value, alt, url, href }} />;
    } else {
        const { src, caption } = media;
        // local video
        if (src.startsWith('https://assets.uniweb.app/')) {
            const videoElement = (
                <video
                    title={caption}
                    src={src}
                    className={twMerge('absolute inset-0 w-full h-full', className)}
                    controls
                    autoPlay={thumbnail ? true : undefined}
                ></video>
            );

            return (
                <div className={twMerge('relative')} style={style ?? { paddingBottom: '56.25%' }}>
                    {thumbnail ? (
                        <FacadeVideo profile={profile} thumbnail={thumbnail} className={className}>
                            {videoElement}
                        </FacadeVideo>
                    ) : (
                        videoElement
                    )}
                </div>
            );
        } else {
            return (
                <ExternalVideo
                    profile={profile}
                    media={media}
                    className={className}
                    style={style}
                    asBg={asBg}
                    thumbnail={thumbnail}
                    block={block}
                />
            );
        }
    }
}

const FacadeVideo = ({ profile, thumbnail, children, className }) => {
    const [showVideo, setShowVideo] = useState(false);

    const { value, alt, url } = thumbnail;

    if (!showVideo) {
        return (
            <>
                <div className="absolute inset-0 w-full h-full">
                    <Image {...{ profile, value, alt, url, className }} />
                </div>
                <div
                    className="absolute inset-0 w-full h-full flex items-center justify-center cursor-pointer group"
                    onClick={() => {
                        setShowVideo(true);
                    }}
                >
                    <div className="w-12 h-12 py-2 pl-2.5 pr-1.5 ring-1 ring-gray-200 rounded-full bg-white/75 group-hover:bg-white">
                        <BiPlay className="w-full h-full text-indigo-500" />
                    </div>
                </div>
            </>
        );
    } else {
        return children;
    }
};
