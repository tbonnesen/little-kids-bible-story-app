import React from 'react';
import { motion } from 'framer-motion';
import { stories } from '../data/stories';
import StoryCard from '../components/StoryCard';
import './Home.css';

const Home = () => {
    return (
        <motion.div
            className="home-container"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
        >
            <header className="home-header">
                <motion.h1
                    className="home-title"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    God's Big Stories
                </motion.h1>
                <motion.p
                    className="home-subtitle"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Fun tales about love, courage, and kindness!
                </motion.p>
            </header>

            <main className="stories-grid-container">
                <div className="stories-grid">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <StoryCard story={story} />
                        </motion.div>
                    ))}
                </div>
            </main>
        </motion.div>
    );
};

export default Home;
