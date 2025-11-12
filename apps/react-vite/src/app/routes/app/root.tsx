// Outlet is a react-router placeholder that renders the matching child route
import { Outlet } from 'react-router';

// DashboardLayout is the shared layout used for the protected app area
import { DashboardLayout } from '@/components/layouts';

// ErrorBoundary for the App root: react-router will render this if a child
// throws during rendering or in loader/action. Keep it minimal here.
export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>;
};

// AppRoot composes the DashboardLayout and uses <Outlet /> as the place
// where nested child routes (e.g. /app/dashboard, /app/discussions) will
// be rendered.
const AppRoot = () => {
  return (
    <DashboardLayout>
      {/* Outlet renders the active child route component here */}
      <Outlet />
    </DashboardLayout>
  );
};

export default AppRoot;
