// AppProvider wires up top-level contexts (auth, react-query, theme, etc.)
import { AppProvider } from './provider';
// AppRouter contains the application's route configuration and RouterProvider
import { AppRouter } from './router';

// The `App` component composes global providers around the router. This is
// the component mounted by `main.tsx`.
export const App = () => {
  return (
    // AppProvider: places context providers (QueryClientProvider, AuthProvider,
    // ThemeProvider, etc.) so that the whole app tree can use them.
    <AppProvider>
      {/* AppRouter handles routing and renders the current route's UI */}
      <AppRouter />
    </AppProvider>
  );
};
