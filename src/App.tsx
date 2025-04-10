import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import GlobalStyles from './styles/GlobalStyles';
import Login from './components/Login';
import DogSearch from './components/DogSearch';
import Layout from './components/Layout';
import { useAuth } from './context/AuthContext';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: 'rgb(125 31 112)',
      light: 'rgb(40 34 67)',
      dark: 'rgb(95 20 85)',
    },
    secondary: {
      main: '#e91e63',
    },
    text: {
      primary: 'rgb(9 3 37)',
      secondary: 'rgba(9, 3, 37, 0.7)',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          '&:hover': {
            backgroundColor: 'rgb(95 20 85)',
          }
        }
      }
    }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      color: 'rgb(9 3 37)',
    },
    h5: {
      color: 'rgb(9 3 37)',
    },
    h6: {
      color: 'rgb(9 3 37)',
    },
    body1: {
      color: 'rgb(9 3 37)',
    },
    body2: {
      color: 'rgba(9, 3, 37, 0.8)',
    },
  },
});

const queryClient = new QueryClient();

const SearchPage = () => {
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesCount, setFavoritesCount] = useState(0);
  
  const handleToggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };
  
  const handleUpdateFavoritesCount = (count: number) => {
    setFavoritesCount(count);
  };
  
  return (
    <Layout 
      favoritesCount={favoritesCount}
      onFavoritesClick={handleToggleFavorites}
    >
      <DogSearch 
        onToggleFavoritesDrawer={handleToggleFavorites}
        onFavoritesCountChange={handleUpdateFavoritesCount}
        showFavoritesDrawer={showFavorites}
      />
    </Layout>
  );
};

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route 
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        <Router>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App; 