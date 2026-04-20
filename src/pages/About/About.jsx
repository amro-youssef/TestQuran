import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <h1>About Test Quran</h1>
      <p>
        Test Quran is a free tool designed to help Muslims test and strengthen their memorisation of the Holy Quran.
      </p>
      <p>
        It's inspired by traditional Quran memorisation techniques, where a <em>sheikh</em> tests their student by asking them to recite from a random ayah, and they are expected to continue from there.
      </p>
      <p>
        It's simple. Select the range of verses you want to be tested on, then choose whether you want to see the verse on screen or hear it. Click to get a random verse and try to recite what comes next. Once you've guessed, click the uncover button to reveal the next verses and see whether you were correct.
      </p>
      <p>
        Want to do a test? Click the test button, select the range of verses and the number of questions to get a test made for you. At the end of the test you can see your results, and past results can be reviewed later from the Test Results page.
      </p>

      <p>
        Verse text and audio are provided via the <a href="https://api-docs.quran.com" target="_blank" rel="noreferrer" className={`${localStorage.getItem('darkMode') === 'false' ? '' : 'dark-text-link'} text-link`}>Quran.com API</a>.
      </p>
      <p>
        Have feedback or suggestions? Fill out the <a href="https://forms.gle/o4oxGsqGaBUqaWqi8" target="_blank" rel="noreferrer" className={`${localStorage.getItem('darkMode') === 'false' ? '' : 'dark-text-link'} text-link`}>feedback form</a>.
      </p>
    </div>
  );
};

export default About;
