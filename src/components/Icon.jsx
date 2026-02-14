import React from 'react';
import {
    Sun, Ship, Shield, Fish, Star, Heart,
    Leaf, Waves, Castle, Cat, Palette, Utensils,
    TreeDeciduous, Footprints, Search,
    Cloud, Flame, Scroll, Ear, Zap,
    Wheat, Bird, Crown, Droplets, HandHeart,
    Coins, Apple, Sparkles, MessageCircle, Baby
} from 'lucide-react';

const iconMap = {
    Sun, Ship, Shield, Fish, Star, Heart,
    Leaf, Waves, Castle, Cat, Palette, Utensils,
    TreeDeciduous, Footprints, Search,
    Cloud, Flame, Scroll, Ear, Zap,
    Wheat, Bird, Crown, Droplets, HandHeart,
    Coins, Apple, Sparkles, MessageCircle, Baby
};

const Icon = ({ name, size = 24, color = 'currentColor', className = '' }) => {
    const LucideIcon = iconMap[name] || Sun;
    return <LucideIcon size={size} color={color} className={className} />;
};

export default Icon;
