import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import Embedded from './Embedded'; // Import the Embedded component for the overlay

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
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const handleUploadClick = () => {
    setDialogOpen(true); // Open the dialog when "Upload" is clicked
  };

  const handleCloseDialog = () => {
    setDialogOpen(false); // Close the dialog
  };
  const [embedUrl, setEmbedUrl] = useState('');


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
        onClick={handleUploadClick}
      >
        Upload
      </Button>

      {/* Embedded Dialog for success message and embed code */}
      <Embedded open={dialogOpen} onClose={handleCloseDialog} embedUrl={embedUrl} />

    </Box>
  );
};

export default Hierarchy;
