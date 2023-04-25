import { useEffect, useState } from "react";
import { supabase } from "./client";
import { Link } from "react-router-dom";
import "../App.css";

const Favorites = () => {
  const API_KEY = import.meta.env.VITE_APP_API_KEY;
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    async function fetchFavorites() {
      const user = await supabase.auth.getUser();
      //   console.log(user.data.user.id);
      if (user.data.user != null) {
        const { data: favorites, error } = await supabase
          .from("favorite")
          .select("recipe_id")
          .eq("user_id", user.data.user.id);
        if (error) {
          console.error(error);
          alert("An error occurred while fetching your favorites.");
        } else {
          const promises = favorites.map(async (favorite) => {
            const recipeId = favorite.recipe_id;
            const response = await fetch(
              `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
            );
            const data = await response.json();
            console.log(data.image);
            return { id: recipeId, title: data.title, image: data.image };
          });
          const recipes = await Promise.all(promises);
          setFavorites(recipes);
        }
      }
    }
    fetchFavorites();
  }, [API_KEY]);

  return (
    <div className="favorites">
      <h2>Your Favorites</h2>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.id}>
            <Link to={"/recipe/" + favorite.id} target="_blank">
              <img src={favorite.image} alt={favorite.title} />
              <h3>{favorite.title}</h3>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favorites;
