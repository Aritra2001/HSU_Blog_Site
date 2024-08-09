import { Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer/Footer';
import Navbar from './components/Navbar/Navbar';
import AdminAudioBooks from './pages/AdminAudip/AdminAudio';
import AllAudio from './pages/AllAudio/AllAudio';
import AllResource from './pages/AllResource/AllResource';
import AudioBookDetail from './pages/AudioBook Page/AudiobookDetails';
import CreateAudio from './pages/CreateAudio/CreateAudio';
import CreateProject from './pages/CreateProject/CreateProject';
import CreateResource from './pages/CreateResource/CreateResource';
import Dashboard from './pages/Dashboard/Dashboard';
import EditAudio from './pages/EditAudio';
import PendingContents from './pages/Pending/PendingContent';
import ResourceDetails from './pages/Resource Page/ResourceDetails';
import ViewResource from './pages/ViewResource/ViewResource';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/createResource' element={<CreateResource/>}/>
        <Route path= '/createAudioBook' element={<CreateAudio/>}/>
        <Route path= '/createProject' element={<CreateProject/>}/>
        <Route path= '/pending' element={<PendingContents/>}/>
        <Route path="/audio/:id" element={<AudioBookDetail/>} />
        <Route path='/viewResource/:id' element={<ViewResource />} />
        <Route path='/allAudio' element={<AllAudio />} />
        <Route path='/AdminAudio' element={<AdminAudioBooks />} />
        <Route path='/EditAudio/:id' element={<EditAudio />} />
        {/* Resource Routes */} 
        <Route path='/allResource' element={<AllResource />} />
        <Route path="/resource/:id" element={<ResourceDetails/>} />

      </Routes>
      <Footer/>
      
    </div>
  );
}

export default App;
