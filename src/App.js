
import './App.css';
import DashBoard from './components/DashBoard/DashBoard';
import Overview from './components/Overview/Overview';
import ActiveProjects from './components/ActiveProjects/ActiveProjects';
import ProjectDetail from './components/ActiveProjects/ProjectDetail';
import Modules from './components/Modules/Modules';
import TxKG from './components/TxKG/TxKG';
import LiteratureMining from './components/LiteratureMining/LiteratureMining';
import DataCurationEngine from './components/DataCurationEngine/DataCurationEngine';
import ScreeningSuite from './components/ScreeningSuite/ScreeningSuite';
import NoveltySearchAgent from './components/NoveltySearchAgent/NoveltySearchAgent';
import AboutUs from './components/AboutUs/AboutUs';
import Login from './components/Login';
import WebSocketComponent from './components/WebSocket';
import DrugDataCollection from './components/DataCurationEngine/DrugDataCollection';
import StructureDownload from './components/ScreeningSuite/StructureDownload';
import MolecularInteractions from './components/ScreeningSuite/MolecularInteractions';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProjectsProvider } from './context/ProjectsContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/dashboard",
    element: <DashBoard />,
    children: [
      { index: true, element: <Overview /> },
      { path: "active-projects",            element: <ActiveProjects /> },
      { path: "active-projects/:projectId", element: <ProjectDetail /> },
      { path: "modules",                    element: <Modules /> },
      { path: "TxKG-knowledge-graph",       element: <TxKG /> },
      { path: "literature-mining",          element: <LiteratureMining /> },
      { path: "data-curation-engine",       element: <DrugDataCollection /> },
      { path: "screening-suite",            element: <StructureDownload /> },
      { path: "novelty-search-agent",       element: <NoveltySearchAgent /> },
      { path: "aboutus",                    element: <AboutUs /> },
      { path: "webSocket",                  element: <WebSocketComponent /> },
      { path: "analytics",                  element: <Overview /> },
    ],
  },
]);

function App() {
  return (
    <ProjectsProvider>
      <RouterProvider router={router} />
    </ProjectsProvider>
  );
}

export default App;
