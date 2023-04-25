import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../App.css";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const API_KEY = import.meta.env.VITE_APP_API_KEY;

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
    axios
      .get(
        `https://api.spoonacular.com/food/ingredients/autocomplete?query=${event.target.value}&number=10&apiKey=${API_KEY}`
      )
      .then((res) => {
        setSuggestions(res.data.map((suggestion) => suggestion.name));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
    setSearchTerm("");
  };

  const handleDeleteIngredient = (ingredient) => {
    setIngredients(ingredients.filter((ing) => ing !== ingredient));
  };

  const handleSearch = () => {
    const ingredientList = ingredients.join(",+");
    axios
      .get(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredientList}&number=5&apiKey=${API_KEY}`
      )
      .then((res) => {
        setRecipes(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="search-container">
      <div>
        <input
          type="text"
          placeholder="Search ingredients..."
          value={searchTerm}
          onChange={handleInputChange}
          list="suggestions"
        />
        <datalist id="suggestions">
          {suggestions.map((suggestion) => (
            <option key={suggestion} value={suggestion} />
          ))}
        </datalist>
        <button onClick={() => handleAddIngredient(searchTerm)}>Add</button>
      </div>
      <div>
        {ingredients.map((ingredient) => (
          <div key={ingredient}>
            {ingredient}
            <button onClick={() => handleDeleteIngredient(ingredient)}>
              X
            </button>
          </div>
        ))}
      </div>
      <div>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="recipe-card">
        {recipes.length > 0 && (
          <ul>
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <Link to={"/recipe/" + recipe.id} target="_blank">
                  <div className="recipe-card">
                    <div className="recipe-image">
                      <img
                        src={`${recipe.image}`}
                        alt={recipe.title}
                        width="250px"
                        height="250px"
                      />
                    </div>
                    <div className="recipe-details">
                      <h3>{recipe.title}</h3>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Search;
