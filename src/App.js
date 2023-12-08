import './App.css';
import Title from './components/Title/Title';
import Header from './components/Header/Header';
import VersePicker from './components/VersePicker/VersePicker';
import Verse from './components/Verse/Verse';

const App = () => {
  return (
    <div className="App">
      <Header />
      <Title />
      <VersePicker />
      <Verse />
    </div>
  );
}

export default App;
