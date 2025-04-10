import { useState } from 'react';
import styled from 'styled-components';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  Button,
  Divider,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dog } from '../types/types';
import { getMatch, getDogs } from '../api/fetchApi';

const FavoritesContainer = styled(Box)`
  padding: 20px;
  height: 100%;
  display: flex;
  flex-direction: column;

  @media (max-width: 600px) {
    width: 100%;
    padding: 16px;
  }
`;

const ScrollableList = styled(List)`
  flex-grow: 1;
  overflow-y: auto;
  padding: 0;
  margin-bottom: 16px;
`;

const EmptyState = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px;
`;

const StyledListItem = styled(ListItem)`
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  }
`;

interface FavoritesProps {
  favorites: Dog[];
  onRemoveFavorite: (dog: Dog) => void;
  onClose: () => void;
  onMatch: (dog: Dog) => void;
}

const Favorites = ({
  favorites,
  onRemoveFavorite,
  onClose,
  onMatch,
}: FavoritesProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleGenerateMatch = async () => {
    if (favorites.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const favoriteIds = favorites.map((dog) => dog.id);
      const matchResult = await getMatch(favoriteIds);
      
      if (matchResult.match) {
        const [matchedDog] = await getDogs([matchResult.match]);
        onMatch(matchedDog);
      } else {
        setError('No match was found. Please try again or add more dogs to your favorites.');
      }
    } catch (error) {
      console.error('Error generating match:', error);
      setError('Failed to generate a match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <FavoritesContainer>
      <Typography variant="h6" gutterBottom sx={{ fontSize: isMobile ? '1.1rem' : '1.25rem' }}>
        Your Favorite Dogs
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {favorites.length === 0 ? (
        <EmptyState>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            You haven't added any dogs to your favorites yet.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Browse the dogs and click "Add to Favorites" to add them here.
          </Typography>
        </EmptyState>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {favorites.length} {favorites.length === 1 ? 'dog' : 'dogs'} in your favorites
          </Typography>
          <ScrollableList>
            {favorites.map((dog) => (
              <StyledListItem
                key={dog.id}
                secondaryAction={
                  <IconButton 
                    edge="end" 
                    aria-label={`Remove ${dog.name} from favorites`} 
                    onClick={() => onRemoveFavorite(dog)}
                    size={isMobile ? "small" : "medium"}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar alt={dog.name} src={dog.img} />
                </ListItemAvatar>
                <ListItemText
                  primary={dog.name}
                  secondary={`${dog.breed} • ${dog.age} ${dog.age === 1 ? 'year' : 'years'} old`}
                  sx={{ 
                    '& .MuiListItemText-primary': { 
                      typography: isMobile ? 'body1' : 'h6' 
                    }
                  }}
                />
              </StyledListItem>
            ))}
          </ScrollableList>

          <Box sx={{ mt: 'auto' }}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleGenerateMatch}
              disabled={loading || favorites.length === 0}
              sx={{ mb: 1, color: 'white' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Match'}
            </Button>
            <Button variant="outlined" fullWidth onClick={onClose}>
              Close
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </FavoritesContainer>
  );
};

export default Favorites; 