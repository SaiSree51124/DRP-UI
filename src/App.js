
import './App.css';
import DashBoard from './components/DashBoard/DashBoard';
import LiteratureMining from './components/DashBoard/LiteratureMining';
import DataCurationEngine from './components/DashBoard/DataCurationEngine';
import ScreeningSuite from './components/DashBoard/ScreeningSuite';
// import NoveltySearchModule from './components/DashBoard/NoveltySearchModule';
import StructureDownload from './components/DashBoard/StructureDownload';
import TxKG from './components/DashBoard/TxKG';
import Login from './components/Login';
import MolecularInteractions from './components/DashBoard/MolecularInteractions';
import { createBrowserRouter, RouterProvider,Navigate  } from 'react-router-dom';
//import DrugDataValidation from './components/DashBoard/DrugDataValidation';
//import DataCurationEngine from './components/DashBoard/DataCurationEngine';
import DrugDataCollection from './components/DashBoard/DrugDataCollection';
import AboutUs from './components/DashBoard/AboutUs';
import WebSocketComponent from './components/WebSocket';
import NoveltySearchAgent from './components/DashBoard/NoveltySearchAgent';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
    children: [
      {
        index: true,  // This makes it the default route under /dashboard
        element: <Navigate to="TxKG-knowledge-graph" replace />,
      },
      {
        path: "TxKG-knowledge-graph",
        element: <TxKG />,
      },
      {
        path: "literature-mining",
        element: <LiteratureMining />,
      },
      {
        path: "data-curation-engine",
        element: <DrugDataCollection />,
      },
      {
        path: "screening-suite",
        element: <StructureDownload />,
      },
      // {
      //   path: "novelty-search-module",
      //   element: <NoveltySearchModule />,
      // },
      {
        path: "novelty-search-agent",
        element: <NoveltySearchAgent />,
      },
      {
        path: "aboutus",
        element: <AboutUs />,
      },
      {
        path: "webSocket",
        element: < WebSocketComponent/>,
      },
    ],
  },
]);
function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
