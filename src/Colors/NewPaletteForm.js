import React, { useState } from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import PaletteFormNav from "./PaletteFormNav";
import ColorPickerForm from "./ColorPickerForm";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Button from "@material-ui/core/Button";
import DraggableColorList from "./DraggableColorList";
import { arrayMove } from "react-sortable-hoc";
import styles from "../styles/NewPaletteFormStyles";
import seedColors from "./seedColors";

const NewPaletteForm = ({ classes, maxColors, palettes, savePalette }) => {
  const [open, setOpen] = useState(true);
  const [colors, setColors] = useState(seedColors[0].colors);

  const paletteIsFull = colors.length >= maxColors;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const addNewColor = (newColor) => {
    setColors([...colors, newColor]);
  };

  // const handleChange = (evt) => {
  //   setColors({
  //     [evt.target.name]: evt.target.value,
  //   });
  // };

  const clearColors = () => {
    setColors([]);
  };

  const addRandomColor = () => {
    const allColors = palettes.map((p) => p.colors).flat();
    let randomColor;
    let isDuplicateColor = true;

    // eslint-disable-next-line no-loop-func
    while (isDuplicateColor) {
      const rand = Math.floor(Math.random() * allColors.length);
      randomColor = allColors[rand];
      isDuplicateColor = colors.some(
        (color) => color.name === randomColor.name
      );
    }

    setColors([...colors, randomColor]);
  };

  const handleSubmit = (newPalette) => {
    newPalette.id = newPalette.paletteName.toLowerCase().replace(/ /g, "-");
    newPalette.colors = colors;
    savePalette(newPalette);
    // Since this is a functional component, you can use React Router hooks like useHistory if you have set up routes
    // useHistory().push('/');
  };

  const removeColor = (colorName) => {
    setColors(colors.filter((color) => color.name !== colorName));
  };

  const onSortEnd = ({ oldIndex, newIndex }) => {
    setColors(arrayMove(colors, oldIndex, newIndex));
  };

  return (
    <div className={classes.root}>
      <PaletteFormNav
        open={open}
        palettes={palettes}
        handleSubmit={handleSubmit}
        handleDrawerOpen={handleDrawerOpen}
      />
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <div className={classes.container}>
          <Typography variant="h4" gutterBottom>
            Design Your Palette
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant="contained"
              color="secondary"
              onClick={clearColors}
              className={classes.button}>
              Clear Palette
            </Button>
            <Button
              variant="contained"
              className={classes.button}
              color="primary"
              onClick={addRandomColor}
              disabled={paletteIsFull}>
              Random Color
            </Button>
          </div>
          <ColorPickerForm
            paletteIsFull={paletteIsFull}
            addNewColor={addNewColor}
            colors={colors}
          />
        </div>
      </Drawer>
      <main
        className={classNames(classes.content, {
          [classes.contentShift]: open,
        })}>
        <div className={classes.drawerHeader} />
        <DraggableColorList
          colors={colors}
          removeColor={removeColor}
          axis="xy"
          onSortEnd={onSortEnd}
          distance={20}
        />
      </main>
    </div>
  );
};

export default withStyles(styles, { withTheme: true })(NewPaletteForm);
