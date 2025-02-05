import React, { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
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


const Hierarchy = ({ hierarchy, modelFile }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };

  const handleUploadToAWS = async () => {
    if (!modelFile) {
      alert('Please load a model first!');
      return;
    }

    try {
      // Get file name without extension
      const fileName = modelFile.name.replace(/\.[^/.]+$/, "");
      
      // Create directory handle for "C:/Documents"
      const dirHandle = await window.showDirectoryPicker({
        startIn: 'documents'  // This will suggest Documents directory first
      });
      
      // Create subdirectory with model name
      const modelDirHandle = await dirHandle.getDirectoryHandle(fileName, { create: true });
      
      // Create file handle
      const fileHandle = await modelDirHandle.getFileHandle(modelFile.name, { create: true });
      
      // Write file content
      const writable = await fileHandle.createWritable();
      await writable.write(modelFile);
      await writable.close();

      alert(`Model saved successfully to:\nDocuments/${fileName}/${modelFile.name}`);
    } catch (error) {
      console.error('Error saving file:', error);
      alert(`Save failed: ${error.message}`);
    }
  };

  const handleUploadToAmplify = async () => {
    if (!modelFile) {
      alert('Please load a model first!');
      return;
    }

    try {
      // Generate unique folder name
      const folderName = `models/${Date.now()}`;
      
      // Upload the file to Amplify Storage
      const result = await Storage.put(
        `${folderName}/${modelFile.name}`, 
        modelFile,
        {
          contentType: modelFile.type,
          progressCallback(progress) {
            console.log(`Uploaded: ${progress.loaded}/${progress.total}`);
          },
        }
      );

      alert(`Model successfully uploaded to Amplify!\nPath: ${result.key}`);
      console.log('Upload result:', result);
    } catch (error) {
      console.error('Error uploading to Amplify:', error);
      alert(`Upload failed: ${error.message}`);
    }
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
        onClick={handleUploadToAmplify}
        // Upload functionality (keeping button)
      >
        Upload to Aws
      </Button>
    </Box>
  );
};

export default Hierarchy;
