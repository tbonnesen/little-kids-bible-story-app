import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Square, SkipForward, SkipBack, Check, Moon, Star } from 'lucide-react';
import { stories } from '../data/stories';
import Icon from '../components/Icon';
import { getBestVoice } from '../utils/audioUtils';
import './BedtimeMode.css';

const BedtimeMode = () => {
    const [mode, setMode] = useState('selection'); // 'selection' or 'player'
    const [selectedStoryIds, setSelectedStoryIds] = useState([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Check if voice preference exists
    const [preferredVoice, setPreferredVoice] = useState(null);

    useEffect(() => {
        const loadVoice = () => {
            const savedVoiceName = localStorage.getItem('preferredVoice');
            if (savedVoiceName) {
                const voices = window.speechSynthesis.getVoices();
                const voice = voices.find(v => v.name === savedVoiceName);
                if (voice) {
                    setPreferredVoice(voice);
                } else {
                    setPreferredVoice(getBestVoice(voices));
                }
            } else {
                const voices = window.speechSynthesis.getVoices();
                setPreferredVoice(getBestVoice(voices));
            }
        };

        loadVoice();
        window.speechSynthesis.onvoiceschanged = loadVoice;

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const toggleStorySelection = (id) => {
        setSelectedStoryIds(prev =>
            prev.includes(id)
                ? prev.filter(sId => sId !== id)
                : [...prev, id]
        );
    };

    const startBedtimeMode = () => {
        if (selectedStoryIds.length > 0) {
            setMode('player');
            setCurrentStoryIndex(0);
            playStory(0);
        }
    };

    const playStory = (index) => {
        window.speechSynthesis.cancel();
        const storyId = selectedStoryIds[index];
        const story = stories.find(s => s.id === storyId);

        if (!story) return;

        const text = `${story.title}. ${story.content.join(' ')}. Goodnight.`;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.85; // Slower for bedtime
        utterance.pitch = 0.9; // Lower/calmer pitch

        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => {
            setIsPlaying(false);
            if (index < selectedStoryIds.length - 1) {
                // Wait a moment then play next
                setTimeout(() => {
                    setCurrentStoryIndex(prev => prev + 1);
                    playStory(index + 1);
                }, 2000);
            } else {
                // Done with playlist
                setMode('selection');
            }
        };

        // Simple progress simulation since SpeechSynthesis API doesn't provide precise time duration
        let progressInterval = setInterval(() => {
            if (window.speechSynthesis.speaking) {
                setProgress(prev => Math.min(prev + 1, 99)); // Cap at 99 until onend
            } else {
                clearInterval(progressInterval);
            }
        }, (text.length * 50) / 100); // Rough estimate

        utterance.onend = () => {
            clearInterval(progressInterval);
            setProgress(100);
            setIsPlaying(false);
            if (index < selectedStoryIds.length - 1) {
                setTimeout(() => {
                    setCurrentStoryIndex(prev => prev + 1);
                    playStory(index + 1);
                    setProgress(0);
                }, 2000);
            } else {
                setTimeout(() => {
                    setMode('selection');
                    setSelectedStoryIds([]);
                }, 2000);
            }
        };

        window.speechSynthesis.speak(utterance);
    };

    const togglePlayPause = () => {
        if (isPlaying) {
            window.speechSynthesis.pause();
            setIsPlaying(false);
        } else {
            window.speechSynthesis.resume();
            setIsPlaying(true);
        }
    };

    const skipNext = () => {
        if (currentStoryIndex < selectedStoryIds.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            playStory(currentStoryIndex + 1);
        }
    };

    const skipPrev = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            playStory(currentStoryIndex - 1);
        }
    };

    const exitBedtime = () => {
        window.speechSynthesis.cancel();
        setMode('selection');
        setIsPlaying(false);
    };

    // Render Selection Mode
    if (mode === 'selection') {
        return (
            <motion.div
                className="bedtime-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <header className="bedtime-header">
                    <h1 className="bedtime-title">
                        <Moon size={40} fill="#ffd700" />
                        Bedtime Mode
                    </h1>
                    <p className="bedtime-subtitle">Pick stories to help you sleep.</p>
                </header>

                <div className="playlist-selection">
                    <div className="story-selector-list">
                        {stories.map(story => (
                            <motion.div
                                key={story.id}
                                className={`story-checkbox-card ${selectedStoryIds.includes(story.id) ? 'selected' : ''}`}
                                onClick={() => toggleStorySelection(story.id)}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="custom-checkbox">
                                    {selectedStoryIds.includes(story.id) && <Check size={16} />}
                                </div>
                                <div className="story-info">
                                    <h3>{story.title}</h3>
                                    <p>{story.summary}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="sticky-footer" style={{ position: 'fixed', bottom: '2rem', left: 0, right: 0, textAlign: 'center', pointerEvents: 'none' }}>
                    <button
                        className="start-bedtime-btn"
                        onClick={startBedtimeMode}
                        disabled={selectedStoryIds.length === 0}
                        style={{ pointerEvents: 'auto' }}
                    >
                        Start Sleepy Time
                    </button>
                    <button
                        className="exit-bedtime-btn"
                        onClick={() => window.history.back()}
                        style={{ pointerEvents: 'auto', marginTop: '1rem', background: 'rgba(0,0,0,0.5)' }}
                    >
                        Exit
                    </button>
                </div>
            </motion.div>
        );
    }

    // Render Player Mode
    const currentStory = stories.find(s => s.id === selectedStoryIds[currentStoryIndex]);

    return (
        <motion.div
            className="bedtime-container bedtime-player"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="star-background"></div> {/* Placeholder for stars */}

            <div className="now-playing-card">
                <div className="playing-icon-large">
                    <Icon name={currentStory.icon} size={100} color="#ffd700" />
                </div>
                <h2 className="playing-title">{currentStory.title}</h2>
                <p className="playing-subtitle">Story {currentStoryIndex + 1} of {selectedStoryIds.length}</p>

                <div className="progress-bar-container">
                    <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>

                <div style={{ marginTop: '3rem' }}></div>

                <div className="player-controls">
                    <button className="control-btn" onClick={skipPrev} disabled={currentStoryIndex === 0}>
                        <SkipBack size={24} />
                    </button>

                    <button className="control-btn play-pause" onClick={togglePlayPause}>
                        {isPlaying ? <Square size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                    </button>

                    <button className="control-btn" onClick={skipNext} disabled={currentStoryIndex === selectedStoryIds.length - 1}>
                        <SkipForward size={24} />
                    </button>
                </div>
            </div>

            <button className="exit-bedtime-btn" onClick={exitBedtime}>
                Stop & Exit
            </button>
        </motion.div>
    );
};

export default BedtimeMode;
