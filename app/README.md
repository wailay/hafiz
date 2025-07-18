# Quran Audio Web App

A clean, minimalistic web application for listening to Quran recitations. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Reciter Selection**: Searchable dropdown for selecting Quran reciters (currently supports Husary, extensible for more)
- **Surah Input**: Number input for selecting Quran chapters (1-114)
- **Ayah Range**: Two number inputs separated by a dash for selecting verse ranges
- **Audio Controls**: Play, download, and loop functionality
- **Modern UI**: Clean, minimalistic design inspired by modern web applications
- **Responsive Design**: Works on both desktop and mobile devices

## Current State

This is a frontend-only implementation with placeholder functionality. The app is ready for backend integration with Quran audio APIs.

### Components

- `ReciterDropdown`: Searchable dropdown for reciter selection
- `SurahInput`: Number input with validation (1-114)
- `AyahRangeInput`: Range selection for verses
- `ControlButtons`: Play, download, and loop controls

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the app directory:
   ```bash
   cd app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── ReciterDropdown.tsx
│   │   ├── SurahInput.tsx
│   │   ├── AyahRangeInput.tsx
│   │   └── ControlButtons.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
```

## Future Enhancements

### Backend Integration
- Integrate with Quran audio APIs (e.g., Quran.com API, MP3Quran.net)
- Implement actual audio playback functionality
- Add MP3 download capability

### Additional Features
- Add more reciters to the dropdown
- Implement ayah validation based on surah length
- Add audio progress bar and time display
- Implement audio caching
- Add favorites/bookmarks functionality
- Support for different audio qualities

### UI/UX Improvements
- Add loading states for audio operations
- Implement error handling and user feedback
- Add keyboard shortcuts
- Improve mobile experience
- Add dark mode support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
