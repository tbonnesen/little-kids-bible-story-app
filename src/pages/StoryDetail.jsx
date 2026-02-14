import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, Target, Volume2, Square, Pause, Play, Settings2 } from 'lucide-react';
import { stories } from '../data/stories';
import Icon from '../components/Icon';
import { getBestVoice, getSortedVoices } from '../utils/audioUtils';
import './StoryDetail.css';

const StoryDetail = () => {
    const { id } = useParams();
    const story = stories.find(s => s.id === parseInt(id));
    const [isReading, setIsReading] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [showVoiceSettings, setShowVoiceSettings] = useState(false);
    const speechRef = useRef(null);

    // Initial scroll and voice loading
    useEffect(() => {
        window.scrollTo(0, 0);

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(getSortedVoices(availableVoices));

            // Try to load saved voice preference or default
            const savedVoiceName = localStorage.getItem('preferredVoice');
            if (savedVoiceName) {
                const navVoice = availableVoices.find(v => v.name === savedVoiceName);
                if (navVoice) {
                    setSelectedVoice(navVoice);
                } else {
                    setSelectedVoice(getBestVoice(availableVoices));
                }
            } else {
                setSelectedVoice(getBestVoice(availableVoices));
            }
        };

        loadVoices();

        // Some browsers load voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const toggleRead = () => {
        if (isReading) {
            window.speechSynthesis.cancel();
            setIsReading(false);
            setIsPaused(false);
        } else {
            const text = `${story.title}. ${story.summary}. ${story.content.join(' ')}`;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            utterance.onend = () => {
                setIsReading(false);
                setIsPaused(false);
            };

            window.speechSynthesis.speak(utterance);
            setIsReading(true);
        }
    };

    const handleVoiceChange = (e) => {
        const voiceName = e.target.value;
        const voice = voices.find(v => v.name === voiceName);
        setSelectedVoice(voice);
        localStorage.setItem('preferredVoice', voiceName);

        // If currently reading, restart with new voice
        if (isReading) {
            window.speechSynthesis.cancel();

            // Small delay to allow cancellation to complete
            setTimeout(() => {
                const text = `${story.title}. ${story.summary}. ${story.content.join(' ')}`;
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.9;
                utterance.pitch = 1.1;
                utterance.voice = voice;

                utterance.onend = () => {
                    setIsReading(false);
                    setIsPaused(false);
                };

                window.speechSynthesis.speak(utterance);
            }, 50);
        }
    };

    if (!story) return <div className="not-found">Story not found!</div>;

    return (
        <motion.div
            className="story-detail-container"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
        >
            <Link to="/" className="back-button">
                <ArrowLeft size={24} />
                <span>Back</span>
            </Link>

            <header
                className="story-header"
                style={{
                    background: story.image ? `url(${story.image}) center/cover no-repeat` : story.bgGradient,
                    position: 'relative' // Ensure relative loading for overlay
                }}
            >
                {story.image && (
                    <div className="story-header-overlay" />
                )}

                {!story.image && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="story-icon-large"
                    >
                        <Icon name={story.icon} size={80} color="white" />
                    </motion.div>
                )}

                <motion.h1
                    className="story-title-large"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ position: 'relative', zIndex: 10 }}
                >
                    {story.title}
                </motion.h1>
            </header>

            <main className="story-content">
                <div className="story-text-container">
                    <div className="audio-controls">
                        <button
                            className={`read-story-btn ${isReading ? 'reading' : ''}`}
                            onClick={toggleRead}
                        >
                            {isReading ? (
                                <>
                                    <Square size={20} fill="currentColor" />
                                    <span>Stop Reading</span>
                                </>
                            ) : (
                                <>
                                    <Volume2 size={24} />
                                    <span>Read to Me</span>
                                </>
                            )}
                        </button>

                        <div className="voice-selector-wrapper">
                            <button
                                className="voice-settings-btn"
                                onClick={() => setShowVoiceSettings(!showVoiceSettings)}
                                aria-label="Audio Settings"
                            >
                                <Settings2 size={20} />
                            </button>

                            {showVoiceSettings && (
                                <motion.div
                                    className="voice-picker-popup"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <label>Choose a Voice:</label>
                                    <select
                                        value={selectedVoice?.name || ''}
                                        onChange={handleVoiceChange}
                                        className="voice-select"
                                    >
                                        {voices.map(voice => (
                                            <option key={voice.name} value={voice.name}>
                                                {voice.name.replace('Google', '').replace('Microsoft', '')}
                                            </option>
                                        ))}
                                    </select>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {story.content.map((paragraph, index) => (
                        <motion.p
                            key={index}
                            className="story-paragraph"
                            initial={{ x: -20, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {paragraph}
                        </motion.p>
                    ))}
                </div>

                <motion.div
                    className="story-takeaways"
                    initial={{ y: 50, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <TakeawayCard
                        icon={<BookOpen size={32} color="#4facfe" />}
                        title="Lesson"
                        text={story.lesson}
                        type="lesson"
                        color="#4facfe"
                    />

                    <TakeawayCard
                        icon={<Star size={32} color="#ff9a9e" />}
                        title="Value"
                        text={story.value}
                        type="value"
                        color="#ff9a9e"
                    />
                </motion.div>
            </main>
        </motion.div>
    );
};

const TakeawayCard = ({ icon, title, text, type, color }) => {
    const controls = useAnimation();

    const handleClick = async () => {
        await controls.start({
            scale: [1, 1.05, 1.05, 1],
            rotate: [0, 3, -3, 0],
            backgroundColor: ["var(--bg-card)", `${color}22`, "var(--bg-card)"],
            boxShadow: [
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                `0 10px 20px ${color}66`,
                "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
            ],
            transition: { duration: 0.5 }
        });
    };

    return (
        <motion.div
            className={`takeaway-card ${type}-card`}
            animate={controls}
            onClick={handleClick}
            whileTap={{ scale: 0.95 }}
            style={{ cursor: 'pointer' }}
        >
            <div className="takeaway-icon">
                {icon}
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
        </motion.div>
    );
};

export default StoryDetail;
