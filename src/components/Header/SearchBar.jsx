// src/components/Header/SearchBar.jsx
import React from "react";
import { TextField, Button, Box } from "@mui/material";

const SearchBar = ({
  searchQuery,
  handleInputChange,
  handleSearchSubmit,
  toggleFilterPopup,
}) => {
  return (
    <Box
      className="header-search-container"
      sx={{ padding: 2, backgroundColor: "#f9f9f9" }}
    >
      <form
        onSubmit={handleSearchSubmit}
        style={{ display: "flex", alignItems: "center" }}
      >
        <TextField
          variant="outlined"
          placeholder="Search meals..."
          value={searchQuery}
          onChange={handleInputChange}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={toggleFilterPopup}
          sx={{ marginLeft: 1 }}
        >
          Filters
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="secondary"
          sx={{ marginLeft: 1 }}
        >
          Search
        </Button>
      </form>
    </Box>
  );
};

export default SearchBar;
