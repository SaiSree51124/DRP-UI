
import './App.css';
import DashBoard from './components/DashBoard/DashBoard';
import HomePage from './components/HomePage/HomePage';
import ActiveProjects from './components/ActiveProjects/ActiveProjects';
import ProjectsPage from './components/Projects/ProjectsPage';
import ProjectDetail from './components/ActiveProjects/ProjectDetail';
import ProjectDetailPage from './components/ActiveProjects/ProjectDetailPage';
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import RecentSessionsPage from './components/RecentSessions/RecentSessionsPage';
import NewResearchPage from './components/NewResearch/NewResearchPage';
import BranchWorkflowPage from './components/NewResearch/BranchWorkflowPage';
import CompleteWorkflow from './components/NewResearch/CompleteWorkflow';
import ResearchLayout from './components/ResearchLayout/ResearchLayout';
import MainLayout from './components/Layout/MainLayout';
import WorkflowLayout from './components/Layout/WorkflowLayout';
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
    path: "/splash",
    element: <SplashScreen />
  },
  {
    path: "/welcome",
    element: <WelcomeScreen />
  },
  {
    path: "/dashboard/new-research",
    element: <ResearchLayout showHeader={false}><NewResearchPage /></ResearchLayout>
  },
  {
    path: "/dashboard/new-research/workflow",
    element: <CompleteWorkflow />
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "recent-sessions", element: <RecentSessionsPage /> },
      { path: "active-projects", element: <ProjectsPage /> },
    ],
  },
  {
    path: "/dashboard-old",
    element: <DashBoard />,
    children: [
      { path: "active-projects/:projectId", element: <ProjectDetailPage /> },
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
