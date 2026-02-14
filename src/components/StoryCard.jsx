import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from './Icon';
import './StoryCard.css';

const StoryCard = ({ story }) => {
    return (
        <Link to={`/story/${story.id}`} className="story-card-link">
            <motion.div
                className="story-card"
                whileHover={{ scale: 1.05, rotate: 1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div
                    className="story-card-header"
                    style={{ background: story.bgGradient }}
                >
                    {/* Decorative circles */}
                    <div className="circle-decoration circle-top-left" />
                    <div className="circle-decoration circle-bottom-right" />

                    {story.image ? (
                        <div className="story-image-container">
                            <img src={story.image} alt={story.title} className="story-image" />
                        </div>
                    ) : (
                        <div className="icon-wrapper">
                            <Icon name={story.icon} size={64} color="white" />
                        </div>
                    )}
                </div>

                <div className="story-card-body">
                    <div className="story-badge-container">
                        <span
                            className="story-badge"
                            style={{ backgroundColor: story.color }}
                        >
                            {story.value}
                        </span>
                    </div>
                    <h3 className="story-title">{story.title}</h3>
                    <p className="story-summary">{story.summary}</p>
                </div>
            </motion.div>
        </Link>
    );
};

export default StoryCard;
