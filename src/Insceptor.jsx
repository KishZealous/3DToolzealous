import React from 'react';
import Button from '@mui/material/Button';
import { pink } from '@mui/material/colors';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/joy/Box';
import FormLabel from '@mui/joy/FormLabel';
import Radio, { radioClasses } from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Sheet from '@mui/joy/Sheet';
import Done from '@mui/icons-material/Done';
import Avatar from '@mui/joy/Avatar';
import FormControl from '@mui/joy/FormControl';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import IconButton from '@mui/joy/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import Typography from '@mui/joy/Typography';

const BgcustomColors = ['#ffffff', '#e7e7e7', '#c1c1c1', '#2c2c2c'];

const Inspector = ({ selectedModel, onSkyboxChange, setShowPreview }) => {
  if (!selectedModel) {
    return <div>No model selected</div>;
  }

  return (
    <Box sx={{ width: 300, bgcolor: 'background.level1', p: 2, height: '100vh', overflowY: 'auto', borderLeft: '1px solid', borderColor: 'divider', boxShadow: 'sm' }}>
      {/* Model Info */}
      <Box sx={{ mb: 3, p: 2, borderRadius: 'sm', boxShadow: 'xs' }}>
        <Typography level="h4" sx={{ mb: 1.5, fontWeight: 'lg' }}>Model Inspector</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography level="body-sm"><strong>Name:</strong> {selectedModel.scene.name || "Unnamed"}</Typography>
          <Typography level="body-sm"><strong>Objects:</strong> {selectedModel.scene.children.length}</Typography>
        </Box>
      </Box>

      {/* Background Settings */}
      <BackgroundSetting />

      {/* Skybox Settings */}
      <SkyboxSetting onSkyboxChange={onSkyboxChange} />

      {/* Preview Button */}
      <PreviewButton setShowPreview={setShowPreview} />
    </Box>
  );
};

const BackgroundSetting = () => {
  const handleColorChange = (color) => {
    const appBgElements = document.getElementsByClassName('AppBg');
    for (let element of appBgElements) {
      element.style.backgroundColor = color;
    }
  };

  return (
    <div>
      <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 'sm', mb: 2 }}>
        <Typography level="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
          <SettingsIcon sx={{ mr: 1, fontSize: '0.8rem' }} />
          Background Settings
        </Typography>
        <BackgroundColorSelector colors={BgcustomColors} defaultColor='#df0a0a' onColorChange={handleColorChange} />
      </Box>
    </div>
  );
};

const BackgroundColorSelector = ({ colors = ['#df0a0a', '#00FF00', '#0000FF', '#FFFF00', '#800080'], defaultColor = '#df0a0a', onColorChange }) => {
  const [selectedColor, setSelectedColor] = React.useState(defaultColor);

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedColor(newColor);
    onColorChange(newColor);
  };

  return (
    <RadioGroup
      value={selectedColor}
      onChange={handleColorChange}
      sx={{ gap: 2, flexWrap: 'wrap', flexDirection: 'row' }}
    >
      {colors.map((color) => (
        <Sheet key={color} sx={{ position: 'relative', width: 20, height: 20, flexShrink: 0, bgcolor: color, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Radio
            overlay
            variant="solid"
            color="neutral"
            checkedIcon={<Done fontSize="xl2" />}
            value={color}
            slotProps={{
              input: { 'aria-label': color },
              radio: { sx: { display: 'contents', '--variant-borderWidth': '2px' } },
            }}
            sx={{ '--joy-focus-outlineOffset': '4px', '--joy-palette-focusVisible': (theme) => theme.vars.palette.neutral[500] }}
          />
        </Sheet>
      ))}
    </RadioGroup>
  );
};

const SkyboxSetting = ({ onSkyboxChange }) => {
  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 'sm', mb: 2 }}>
      <Typography level="h4" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <SettingsIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
        Skybox Settings
      </Typography>
      <SkyboxSelector onSelectionChange={onSkyboxChange} />
    </Box>
  );
};

const SkyboxSelector = ({ onSelectionChange }) => {
  const skyboxOptions = [
    { value: 'apartment', label: 'Apartment' },
    { value: 'city', label: 'City' },
    { value: 'dawn', label: 'Dawn' },
    { value: 'forest', label: 'Forest' },
    { value: 'lobby', label: 'Lobby' },
    { value: 'night', label: 'Night' },
    { value: 'park', label: 'Park' },
    { value: 'studio', label: 'Studio' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'warehouse', label: 'Warehouse' },
  ];

  const handleChange = (event, newValue) => {
    onSelectionChange(newValue);
  };

  return (
    <Select
      defaultValue="studio"
      onChange={handleChange}
      variant="outlined"
      size="sm"
      sx={{ width: 200 }}
    >
      {skyboxOptions.map((option) => (
        <Option key={option.value} value={option.value}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
};

const PreviewButton = ({ setShowPreview }) => {
  const handlePreview = () => {
    setShowPreview(true); // Hide Inspector and Hierarchy panels
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 'sm', mt: 2 }}>
      <Typography level="h4" sx={{ mb: 2 }}>Preview</Typography>
      <Button variant="contained" fullWidth onClick={handlePreview}>
        Open Preview
      </Button>
    </Box>
  );
};

export default Inspector;
