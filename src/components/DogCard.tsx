import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, Box, Skeleton, useMediaQuery, useTheme } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Dog } from '../types/types';

interface DogCardProps {
  dog: Dog;
  isFavorite: boolean;
  onToggleFavorite: (dog: Dog) => void;
}

const StyledCard = styled(Card)`
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const DogImage = styled(CardMedia)`
  height: 200px;
  background-size: cover;
  position: relative;
`;

const DogInfo = styled(CardContent)`
  flex-grow: 1;
  padding: 16px;
`;

const DogCard = ({ dog, isFavorite, onToggleFavorite }: DogCardProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = dog.img;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageError(true);
  }, [dog.img]);

  return (
    <StyledCard elevation={3}>
      {!imageLoaded && !imageError ? (
        <Skeleton variant="rectangular" height={200} animation="wave" />
      ) : imageError ? (
        <Box
          height={200}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bgcolor="grey.200"
        >
          <Typography variant="body2" color="text.secondary">
            Image unavailable
          </Typography>
        </Box>
      ) : (
        <DogImage image={dog.img} title={`Photo of ${dog.name}`} />
      )}
      
      <DogInfo>
        <Typography gutterBottom variant="h5" component="h3" sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}>
          {dog.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Breed:</strong> {dog.breed}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          <strong>Age:</strong> {dog.age} {dog.age === 1 ? 'year' : 'years'} old
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>ZIP Code:</strong> {dog.zip_code}
        </Typography>
      </DogInfo>
      <CardActions>
        <Button
          size="small"
          color={isFavorite ? 'secondary' : 'primary'}
          onClick={() => onToggleFavorite(dog)}
          variant={isFavorite ? 'contained' : 'outlined'}
          fullWidth
          startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          aria-label={isFavorite ? `Remove ${dog.name} from favorites` : `Add ${dog.name} to favorites`}
          sx={{ color: isFavorite ? 'white' : undefined }}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </CardActions>
    </StyledCard>
  );
};

export default DogCard; 