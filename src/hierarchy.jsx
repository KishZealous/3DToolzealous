import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Button 
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledListItem = styled(ListItem)(({ theme, level }) => ({
  paddingLeft: theme.spacing(level * 2),
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:before': {
    content: '"▸"',
    position: 'absolute',
    left: theme.spacing(1),
    color: theme.palette.text.secondary,
  }
}));

const Hierarchy = ({ hierarchy }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  return (
    <Box 
      sx={{
        p: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        maxWidth: 400,
        mx: 'auto',
        bgcolor: 'background.paper'
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        Zealous 3D Tool
      </Typography>

      <List dense sx={{ mb: 2 }}>
        {hierarchy.map((item, index) => {
          const depth = item.path.split('/').length - 1;
          return (
            <StyledListItem
              key={index}
              level={depth}
              button
              selected={selectedIndex === index}
              onClick={() => handleListItemClick(index)}
            >
              <ListItemText 
                primary={item.name}
                primaryTypographyProps={{
                  variant: 'body2',
                  color: selectedIndex === index ? 'primary' : 'textPrimary'
                }}
              />
            </StyledListItem>
          );
        })}
      </List>

      <Button 
        variant="contained" 
        fullWidth
        size="small"
        sx={{ textTransform: 'none' }}
      >
        Expand All
      </Button>
    </Box>
  );
};

export default Hierarchy;