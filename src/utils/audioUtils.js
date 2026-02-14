/**
 * Utility to find the best available English voice for story reading.
 * Prioritizes Premium/Enhanced voices (e.g., Ava, Samantha, Google) over standard ones.
 */

// List of preferred high-quality voices in order of preference
const PREFERRED_VOICES = [
    'Ava (Premium)',
    'Samantha (Enhanced)',
    'Karen (Premium)',
    'Daniel (Enhanced)',
    'Google US English',
    'Microsoft Zira',
    'Samantha',
    'Alex'
];

/**
 * Returns the single best voice for default selection.
 */
export const getBestVoice = (voices) => {
    if (!voices || voices.length === 0) return null;

    // 1. Try to find an exact match from our preferred list
    for (const pref of PREFERRED_VOICES) {
        const found = voices.find(v => v.name.includes(pref));
        if (found) return found;
    }

    // 2. Fallback: Find any English voice labeled "Premium"
    const premiumEnglish = voices.find(v =>
        v.lang.startsWith('en') && v.name.includes('Premium')
    );
    if (premiumEnglish) return premiumEnglish;

    // 3. Fallback: Find any English voice labeled "Enhanced"
    const enhancedEnglish = voices.find(v =>
        v.lang.startsWith('en') && v.name.includes('Enhanced')
    );
    if (enhancedEnglish) return enhancedEnglish;

    // 4. Fallback: Any US English voice
    const usEnglish = voices.find(v => v.lang === 'en-US');
    if (usEnglish) return usEnglish;

    // 5. Final Fallback: First available English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
};

/**
 * Sorts a list of voices to put the highest quality English voices at the top.
 */
export const getSortedVoices = (voices) => {
    if (!voices) return [];

    return [...voices].sort((a, b) => {
        const getScore = (voice) => {
            const name = voice.name;
            const lang = voice.lang;
            const isEnglish = lang.startsWith('en');

            // 1. Top Tier: Manually preferred list
            const prefIndex = PREFERRED_VOICES.findIndex(p => name.includes(p));
            if (prefIndex !== -1) return 100 - prefIndex; // Higher index = lower score, so invert to keep order

            // 2. High Tier: Premium/Enhanced English
            if (isEnglish && (name.includes('Premium') || name.includes('Enhanced'))) return 50;

            // 3. Mid Tier: Standard English
            if (isEnglish) return 10;

            // 4. Low Tier: Others
            return 0;
        };

        const scoreA = getScore(a);
        const scoreB = getScore(b);

        if (scoreA !== scoreB) return scoreB - scoreA; // Descending score
        return a.name.localeCompare(b.name); // Alphabetical fallback
    });
};
