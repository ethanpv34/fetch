import React from 'react';
import styled from 'styled-components';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  useMediaQuery, 
  useTheme, 
  Box,
  IconButton,
  Badge 
} from '@mui/material';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PetsIcon from '@mui/icons-material/Pets';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useAuth } from '../context/AuthContext';

const StyledAppBar = styled(AppBar)`
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Content = styled(Container)`
  padding-top: 80px;
  padding-bottom: 40px;
  min-height: calc(100vh - 64px);
  
  @media (max-width: 600px) {
    padding-top: 70px;
    padding-left: 12px;
    padding-right: 12px;
  }
`;

const BrandContainer = styled(Box)`
  display: flex;
  align-items: center;
  gap: 8px;
`;

interface LayoutProps {
  children: React.ReactNode;
  favoritesCount?: number;
  onFavoritesClick?: () => void;
}

const Layout = ({ 
  children, 
  favoritesCount = 0, 
  onFavoritesClick 
}: LayoutProps) => {
  const { logout, user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <BrandContainer sx={{ 
            flexGrow: 1, 
            justifyContent: 'flex-start',
            position: 'relative'
          }}>
            <PetsIcon sx={{ color: 'white' }} />
            <Typography variant="h6" component="div" sx={{ color: 'white' }}>
              Fetch Dog Adoption
            </Typography>
          </BrandContainer>
          
          {isMobile ? (
            <Box display="flex" gap={1}>
              {onFavoritesClick && (
                <IconButton 
                  color="inherit" 
                  onClick={onFavoritesClick} 
                  aria-label="View favorites" 
                  sx={{ color: 'white' }}
                >
                  <Badge badgeContent={favoritesCount} color="secondary">
                    <FavoriteIcon />
                  </Badge>
                </IconButton>
              )}
              <IconButton color="inherit" onClick={logout} aria-label="Logout" sx={{ color: 'white' }}>
                <ExitToAppIcon />
              </IconButton>
            </Box>
          ) : (
            <Box 
              display="flex" 
              alignItems="center" 
              gap={2}
              sx={{ 
                position: 'absolute',
                right: 24
              }}
            >
              {user && (
                <Typography variant="body2" color="white">
                  Hi, {user.name}
                </Typography>
              )}
              {onFavoritesClick && (
                <Button 
                  color="inherit" 
                  onClick={onFavoritesClick}
                  startIcon={<FavoriteIcon />}
                  sx={{ color: 'white' }}
                >
                  Favorites ({favoritesCount})
                </Button>
              )}
              <Button 
                color="inherit" 
                onClick={logout}
                endIcon={<ExitToAppIcon />}
                sx={{ color: 'white' }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>
      <Content maxWidth="lg">{children}</Content>
    </>
  );
};

export default Layout; 