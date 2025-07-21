# Hafiz

Built this application to help me memorize Quran by making easy Ayah range audio loops

## Development

1. **Start dev server:**

```bash
cd app

npm install

npm run dev
```

2. **Open your browser:**

Navigate to [http://localhost:3000](http://localhost:3000)

### Features

- Quran audio streaming with customizable ayah ranges
- Audio download in MP3 format

### TODOs and Improvements

- When selecting an ayah range to be played, the single MP3 file for each ayah are stitched in a WAV file. When pressing the download button, the WAV file is encoded back to an MP3 on the server side, this process takes a bit of time. Need to improve it.
