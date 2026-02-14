import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Moon } from 'lucide-react';
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

            <nav className="features-nav" style={{ maxWidth: '1200px', margin: '0 auto 3rem', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                <Link to="/characters" style={{ textDecoration: 'none' }}>
                    <motion.div
                        className="feature-card"
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: 'var(--bg-card)',
                            padding: '1.5rem',
                            borderRadius: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                            border: '1px solid var(--border-color)'
                        }}
                    >
                        <div style={{ background: '#e0f2f1', padding: '1rem', borderRadius: '50%', color: '#009688' }}>
                            <Sparkles size={32} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontFamily: 'Fredoka', color: 'var(--color-text)', fontSize: '1.25rem' }}>Meet Characters</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>See all your friends!</p>
                        </div>
                    </motion.div>
                </Link>

                <Link to="/bedtime" style={{ textDecoration: 'none' }}>
                    <motion.div
                        className="feature-card"
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            background: 'linear-gradient(to right, #0f2027, #2c5364)',
                            padding: '1.5rem',
                            borderRadius: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.2)',
                            color: 'white'
                        }}
                    >
                        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '50%', color: '#ffd700' }}>
                            <Moon size={32} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontFamily: 'Fredoka', color: 'white', fontSize: '1.25rem' }}>Bedtime Mode</h3>
                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>Sleepy stories playlist</p>
                        </div>
                    </motion.div>
                </Link>
            </nav>

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
