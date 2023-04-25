import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { supabase } from "./client";
import "../App.css";

const RecipeDetails = () => {
  const [recipe, setRecipe] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState("");
  const [editReviewText, setEditReviewText] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [rating, setRating] = useState(0);
  // const [likes, setLikes] = useState(0);
  const { id } = useParams();
  const API_KEY = import.meta.env.VITE_APP_API_KEY;
  useEffect(() => {
    axios
      .get(
        `https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`
      )
      .then((res) => {
        setRecipe(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    async function fetchReviews() {
      const user = await supabase.auth.getUser();
      const store = user.data.user.id;
      const email = user.data.user.email;
      console.log(email);
      const { data: reviews, error } = await supabase
        .from("Review")
        .select("recipe_id, rating, comment, user_id, email")
        .eq("recipe_id", id)
        .order("created_at", { ascending: false });
      if (error) {
        console.error(error);
        alert("An error occurred while fetching reviews.");
      } else {
        setUserEmail(email);
        setCurrentUser(store);
        setReviews(reviews);
      }
    }
    async function fetchFavorite() {
      const user = await supabase.auth.getUser();

      if (user.data.user != null) {
        const { data: favorite } = await supabase
          .from("favorite")
          .select("recipe_id")
          .eq("recipe_id", id)
          .eq("user_id", user.data.user.id)
          .single();

        if (favorite) {
          setIsFavorite(true);
        }
      }
    }
    fetchReviews();
    fetchFavorite();
  }, [id, API_KEY]);

  async function handleFavorite() {
    const user = await supabase.auth.getUser();

    if (user.data.user == null) {
      alert("You need to sign in to add a recipe to your favorites.");
      return;
    }

    if (isFavorite) {
      const { error } = await supabase
        .from("favorite")
        .delete()
        .eq("recipe_id", id)
        .eq("user_id", user.data.user.id);

      if (error) {
        console.error(error);
        alert(
          "An error occurred while removing the recipe from your favorites."
        );
        return;
      }

      setIsFavorite(false);
    } else {
      console.log(userEmail);
      const { error } = await supabase
        .from("favorite")
        .insert([{ recipe_id: id, user_id: user.data.user.id }])
        .single();

      if (error) {
        console.error(error);
        console.log(user.data.user);
        alert("An error occurred while adding the recipe to your favorites.");
        return;
      }

      setIsFavorite(true);
    }
  }
  // const handleLikeSubmit = async (event) => {
  //   event.preventDefault();
  //   const user = await supabase.auth.getUser();
  //   if (user.data.user == null) {
  //     alert("You need to sign in to leave a review.");
  //     return;
  //   }
  //   const { error } = await supabase
  //     .from("Review")
  //     .update({ like : likes})
  //     .eq("receipe_id", receipe_id)
  // }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const user = await supabase.auth.getUser();
    if (user.data.user == null) {
      alert("You need to sign in to leave a review.");
      return;
    }
    const { error } = await supabase
      .from("Review")
      .insert([
        {
          recipe_id: id,
          user_id: user.data.user.id,
          rating,
          comment: reviewText,
          email: user.data.user.email,
        },
      ])
      .single();
    if (error) {
      console.error(error);
      alert(
        "An error occurred while submitting your review. Please try again."
      );
    } else {
      alert("Your review has been submitted.");
      setReviewText("");
      setRating(0);
    }
  };
  const handleEditReview = async (e, recipe_id) => {
    e.preventDefault();
    await supabase
      .from("Review")
      .update({ comment: editReviewText })
      .eq("recipe_id", recipe_id);
    setEditingReviewId(null);
  };
  const handleDeleteReview = async (user_id, recipe_id) => {
    const { error } = await supabase
      .from("Review")
      .delete()
      .match({ user_id, recipe_id });
    if (error) console.log("Error deleting review:", error);
    else
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.user_id !== user_id)
      );
  };
  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-description">
      <h2>{recipe.title}</h2>
      <img src={recipe.image} width="500px" height="400px" alt={recipe.title} />
      <p dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>
      <h3>Ingredients:</h3>
      <ul>
        {recipe.extendedIngredients.map((ingredient) => (
          <li key={ingredient.id}>{ingredient.original}</li>
        ))}
      </ul>
      {recipe.analyzedInstructions.length > 0 ? (
        <>
          <h3>Instructions:</h3>
          <ol>
            {recipe.analyzedInstructions[0].steps.map((step) => (
              <li key={step.number}>{step.step}</li>
            ))}
          </ol>
        </>
      ) : (
        recipe.sourceUrl && (
          <>
            <h3>Instructions:</h3>
            <p>
              Cant find the instructions, please go to the following website to
              find out more info:{" "}
              <a href={recipe.sourceUrl}>{recipe.sourceName}</a>
            </p>
          </>
        )
      )}
      <button onClick={handleFavorite}>
        {isFavorite ? "Remove from favorites" : "Add to favorites"}
      </button>
      <form onSubmit={handleSubmit}>
        <label>
          Rating (out of 5):
          <input
            type="number"
            min="0"
            max="5"
            value={rating}
            onChange={(event) => setRating(Number(event.target.value))}
          />
        </label>
        <label>
          Leave a review:
          <textarea
            value={reviewText}
            onChange={(event) => setReviewText(event.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <h3>Reviews:</h3>
      {reviews.map((review) => (
        <div key={review.recipe_id}>
          {editingReviewId === review.recipe_id ? (
            <form onSubmit={(e) => handleEditReview(e, review.recipe_id)}>
              <input
                type="text"
                defaultValue={review.comment}
                onChange={(e) => setEditReviewText(e.target.value)}
              />
              <button type="submit">Save</button>
              <button onClick={() => setEditingReviewId(null)}>Cancel</button>
            </form>
          ) : (
            <>
              <p>User:{review.email}</p>
              <p>{review.rating}/5</p>
              <p>{review.comment}</p>
              {review.user_id === currentUser && (
                <>
                  <button onClick={() => setEditingReviewId(review.recipe_id)}>
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteReview(review.user_id, review.recipe_id)
                    }
                  >
                    Delete
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default RecipeDetails;
