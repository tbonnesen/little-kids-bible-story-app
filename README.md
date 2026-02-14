# Kids Bible Stories App

A fun, interactive web app for kids 5 and under to learn key Bible stories, life lessons, and values.

## Features

- **Colorful & Kid-Friendly UI**: Bright colors, large icons, and rounded friendly shapes.
- **Interactive Animations**: Cards bounce on hover, text fades in as you scroll, and smooth page transitions.
- **Key Stories**: Includes 6 foundational stories:
  - God Made the World
  - Noah's Big Boat
  - David and the Giant
  - Jonah and the Whale
  - Baby Jesus is Born
  - The Good Samaritan
- **Lessons & Values**: Each story concludes with a clear "Lesson" and "Value" takeaway.

## Tech Stack

- **React**: For component-based UI.
- **Vite**: For fast development and building.
- **Framer Motion**: For premium animations.
- **Lucide React**: For scalable vector icons.
- **Vanilla CSS**: Custom styling for maximum control (no Tailwind dependency).

## Getting Started

1.  **Install Dependencies** (if not already done):
    ```bash
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open your browser to the URL shown (usually `http://localhost:5173`).

## adding More Stories

Edit `src/data/stories.js` to add new stories. Use the existing format:

```javascript
{
  id: 7,
  title: "New Story",
  summary: "Short description",
  content: ["Paragraph 1", "Paragraph 2"],
  lesson: "Main lesson",
  value: "Core Value",
  icon: "Sun", // Icon name from Lucide
  color: "#color",
  bgGradient: "linear-gradient(...)"
}
```
