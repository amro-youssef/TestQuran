# TestQuran

TestQuran is a web application designed to help Quran memorization students test and strengthen their memorization skills. Inspired by traditional testing methods used by sheikhs, this app provides an interactive and customizable way to practice recalling verses from the Holy Quran.

## Features

- **Random Verse Generation**: Get a random verse from your selected range to test your memorization.
- **Verse Information**: View the chapter (surah) and verse number for context.
- **Audio Recitations**: Listen to the verse recited by any of 13 different reciters.
- **Visual Aid**: See the image of the Quran page of any verse on screen.
- **Test Mode**: Create custom tests with a specified number of questions from a chosen verse range.
- **Progress Tracking**: Review your test results, including correct and incorrect answers, with the ability to revisit them later.
- **Font**: Change the font to suit your preferences.

## Getting Started

### Prerequisites

- Node.js (version 20.5.1 or higher)
- npm (version 10.1.0 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/amro-youssef/TestQuran.git
   ```

2. Navigate to the project directory:
   ```
   cd TestQuran
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and visit `http://localhost:3000` (or the port specified by Vite).

## Usage

1. **Main Page**: 
   - Select the range of verses you want to practice.
   - Click the "Randomize" button to get a random verse from your selected range.
   - Try to guess the next verses, then expand button to show the next 2 verses. Click 'next verse' or 'show rest of chapter' if you want to see more
   - Use the buttons next to the verse to reveal the chapter and verse, to play audio, or view the Quran page.

2. **Test Mode**:
   - Enter the desired verse range and number of questions.
   - For each question, try to guess the next verse, then click the expand button to reveal the answer
   - Mark whether you got the correct or incorrect
   - Review your results at the end of the test and see which verses need more practice.

3. **Settings**:
   - Change the font
   - View test results
   - Toggle whether to automatically play the audio on randomize
   - Toggle whether to hide the next verses until clicked on

## Contributing

We welcome contributions to TestQuran! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with clear, descriptive messages.
4. Push your changes to your fork.
5. Submit a pull request to the main repository.

There's a list of known issues in the 'issues' tab. Feel free to work on any of these, or anything else you think could do with improvement

## Technology Stack

- React
- Vite
- npm

## Contact

Amro Youssef - amro.youssef@ymail.com

Project Link: https://github.com/amro-youssef/TestQuran

## Acknowledgments

- Inspired by traditional Quran memorization testing methods
- A good amount of inspiration was taken from quran.com
- https://api-docs.quran.com/docs/category/quran.com-api
