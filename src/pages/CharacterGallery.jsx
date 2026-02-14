import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, User } from 'lucide-react';
import { stories } from '../data/stories';
import { characterData } from '../data/characterData';  // Import character metadata
import StoryCard from '../components/StoryCard';
import './CharacterGallery.css';

const CharacterGallery = () => {
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    // Get unique characters and count their occurrences
    const characterStats = useMemo(() => {
        const stats = {};
        stories.forEach(story => {
            if (story.characters) {
                story.characters.forEach(char => {
                    stats[char] = (stats[char] || 0) + 1;
                });
            }
        });
        return Object.entries(stats)
            .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])); // Sort by frequency, then name
    }, []);

    const filteredStories = useMemo(() => {
        if (!selectedCharacter) return [];
        return stories.filter(story =>
            story.characters && story.characters.includes(selectedCharacter)
        );
    }, [selectedCharacter]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="character-gallery-container">
            <AnimatePresence mode="wait">
                {!selectedCharacter ? (
                    <motion.div
                        key="gallery"
                        initial="hidden"
                        animate="visible"
                        exit={{ opacity: 0, x: -20 }}
                        variants={containerVariants}
                    >
                        <header className="gallery-header">
                            <h1 className="gallery-title">Meet the Characters</h1>
                            <p className="gallery-subtitle">Click a friend to see their stories!</p>
                        </header>

                        <div className="character-grid">
                            {characterStats.map(([name, count]) => (
                                <motion.div
                                    key={name}
                                    variants={itemVariants}
                                    className="character-card"
                                    onClick={() => setSelectedCharacter(name)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="character-avatar" style={
                                        characterData[name]?.image
                                            ? {
                                                background: `url(${characterData[name].image}) center/cover no-repeat`,
                                                border: `2px solid ${characterData[name].color || 'transparent'}`
                                            }
                                            : {}
                                    }>
                                        {!characterData[name]?.image && name.charAt(0)}
                                    </div>
                                    <h3 className="character-name">{name}</h3>
                                    <span className="character-count">{count} {count === 1 ? 'story' : 'stories'}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="details"
                        className="character-detail-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                    >
                        <div className="selected-character-header">
                            <button
                                className="back-to-gallery-btn"
                                onClick={() => setSelectedCharacter(null)}
                            >
                                <ArrowLeft size={20} />
                                <span>Back to All</span>
                            </button>
                            <h2 className="selected-title">
                                Stories with <span className="character-highlight">{selectedCharacter}</span>
                            </h2>
                        </div>

                        <div className="stories-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                            {filteredStories.map((story, index) => (
                                <motion.div
                                    key={story.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <StoryCard story={story} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CharacterGallery;
