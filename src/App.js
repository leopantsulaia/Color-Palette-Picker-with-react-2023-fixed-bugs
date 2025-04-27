import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Palette from "./Colors/Palette";
import PaletteList from "./Colors/PaletteList";
import SingleColorPalette from "./Colors/SingleColorPalette";
import Page from "./styles/Page";
import NewPaletteForm from "./Colors/NewPaletteForm";
import seedColors from "./Colors/seedColors";
import { generatePalette } from "./Colors/colorHelpers";

function SingleColorPaletteWrapper(props) {
  const params = useParams();
  const colorId = params.colorId;
  const paletteId = params.paletteId;
  return (
    <SingleColorPalette
      colorId={colorId}
      palette={generatePalette(props.findPalette(paletteId))}
    />
  );
}

function PaletteWrapper(props) {
  const params = useParams();
  const id = params.id;
  return <Palette palette={generatePalette(props.findPalette(id))} />;
}

function App() {
  const [palettes, setPalettes] = useState(
    JSON.parse(window.localStorage.getItem("palettes")) || seedColors
  );

  useEffect(() => {
    window.localStorage.setItem("palettes", JSON.stringify(palettes));
  }, [palettes]);

  const findPalette = (id) => {
    return palettes.find((palette) => palette.id === id);
  };

  const deletePalette = (id) => {
    setPalettes((prevPalettes) =>
      prevPalettes.filter((palette) => palette.id !== id)
    );
  };

  const savePalette = (newPalette) => {
    setPalettes((prevPalettes) => [...prevPalettes, newPalette]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/palette/new"
          element={
            <Page>
              <NewPaletteForm savePalette={savePalette} palettes={palettes} />
            </Page>
          }
        />
        <Route
          path="/palette/:paletteId/:colorId"
          element={
            <Page>
              <SingleColorPaletteWrapper findPalette={findPalette} />
            </Page>
          }
        />
        <Route
          path="/"
          element={
            <Page>
              <PaletteList palettes={palettes} deletePalette={deletePalette} />
            </Page>
          }
        />
        <Route
          path="/palette/:id"
          element={
            <Page>
              <PaletteWrapper findPalette={findPalette} />
            </Page>
          }
        />
        <Route
          element={
            <Page>
              <PaletteList palettes={palettes} deletePalette={deletePalette} />
            </Page>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
