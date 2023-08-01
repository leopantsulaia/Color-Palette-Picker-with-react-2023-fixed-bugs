import React, { Component } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Palette from "./Palette";
import PaletteList from "./PaletteList";
import SingleColorPalette from "./SingleColorPalette";
import Page from "./Page";
import NewPaletteForm from "./NewPaletteForm";
import seedColors from "./seedColors";
import { generatePalette } from "./colorHelpers";

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

class App extends Component {
  constructor(props) {
    super(props);
    const savedPalettes = JSON.parse(window.localStorage.getItem("palettes"));
    this.state = { palettes: savedPalettes || seedColors };
    this.savePalette = this.savePalette.bind(this);
    this.findPalette = this.findPalette.bind(this);
    this.deletePalette = this.deletePalette.bind(this);
  }
  findPalette(id) {
    return this.state.palettes.find(function (palette) {
      return palette.id === id;
    });
  }
  deletePalette(id) {
    this.setState(
      (st) => ({
        palettes: st.palettes.filter((palette) => palette.id !== id),
      }),
      this.syncLocalStorage
    );
  }
  savePalette(newPalette) {
    this.setState(
      { palettes: [...this.state.palettes, newPalette] },
      this.syncLocalStorage
    );
  }
  syncLocalStorage() {
    //save palettes to local storage
    window.localStorage.setItem("palettes", JSON.stringify(this.state.palettes));
  }

  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path="/palette/new"
            element={
              <Page>
                <NewPaletteForm
                  savePalette={this.savePalette}
                  palettes={this.state.palettes}
                />
              </Page>
            }
          />
          <Route
            path="/palette/:paletteId/:colorId"
            element={
              <Page>
                <SingleColorPaletteWrapper findPalette={this.findPalette} />
              </Page>
            }
          />
          <Route
            path="/"
            element={
              <Page>
                <PaletteList
                  palettes={this.state.palettes}
                  deletePalette={this.deletePalette}
                />
              </Page>
            }
          />
          <Route
            path="/palette/:id"
            element={
              <Page>
                <PaletteWrapper findPalette={this.findPalette} />
              </Page>
            }
          />
            <Route
              element={
                <Page>
                  <PaletteList
                    palettes={this.state.palettes}
                    deletePalette={this.deletePalette}
                  />
                </Page>
              }
            />
          </Routes>
        </BrowserRouter>
      );
    }
  }
  
  export default App;
  
