import React, { useState, useEffect } from "react";
import { getSingleMovie } from "../../api/movie";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import Container from "../Container";
import RatingStar from "../RatingStar";
import RelatedMovies from "../RelatedMovies";
import AddRatingModal from "../modals/AddRatingModal";
import CustomButtonLink from "../CustomButtonLink";

//for 1k and up reviews method
// const convertReviewCount = (count) => {
//   if (count <= 900) return count;

//   parseFloat(count / 1000).toFixed(2) + "k";
// };

const convertDate = (date) => {
  return date.split("T")[0];
};

export default function SingleMovie() {
  const [ready, setReady] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [movie, setMovie] = useState({});

  const { movieId } = useParams();
  const { updateNotification } = useNotification();
  const { authInfo } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const fetchMovie = async () => {
    const { error, movie } = await getSingleMovie(movieId);
    if (error) return updateNotification("error", error);

    setReady(true);
    setMovie(movie);
  };

  const handleOnRateMovie = () => {
    if (!isLoggedIn) return navigate("/auth/signIn");
    setShowRatingModal(true);
  };

  const hideRatingModal = () => {
    setShowRatingModal(false);
  };

  const handleOnRatingSuccess = (reviews) => {
    setMovie({ ...movie, reviews: { ...reviews } });
  };

  useEffect(() => {
    if (movieId) fetchMovie();
  }, [movieId]);

  if (!ready)
    return (
      <div className="h-screen flex justify-center items-center dark:bg-danger bg-white min-h-screen">
        <div className="text-light-subtle dark:text-dark-subtle">
          Please Wait
        </div>
      </div>
    );

  const {
    id,
    trailer,
    storyLine,
    language,
    releaseDate,
    poster,
    title,
    director = {},
    reviews = {},
    writers,
    cast = [],
    genres = [],
    type,
  } = movie;

  return (
    <div className="dark:bg-danger bg-white min-h-screen pb-10">
      <Container>
        <video poster={poster} controls src={trailer}></video>
        <div className="flex justify-between">
          <h1 className="text-4xl text-primary dark:text-white font-serif py-3">
            {title}
          </h1>
          <div className="flex flex-col items-end">
            <RatingStar rating={reviews.ratingAvg} />
            <CustomButtonLink
              label={(reviews.reviewCount) + " Reviews"}
              onClick={() => navigate("/movie/reviews/" + movieId)}
            />

            <CustomButtonLink
              label="Rate the movie"
              onClick={handleOnRateMovie}
            />
            {/* <Link
              className="text-primary dark:text-white hover:underline"
              to={"/movie/reviews/" + id}
            >
              {reviews.reviewCount} Reviews
            </Link> */}

            {/* <button
              className="text-primary dark:text-white hover:underline"
              type="button"
              onClick={handleOnRateMovie}
            >
              Rate the movie
            </button> */}
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-light-subtle dark:text-dark-subtle">{storyLine}</p>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Director:
            </p>
            <p className="text-primary dark:text-white hover:underline cursor-pointer">
              {director.name}
            </p>
          </div>

          <div className="flex ">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">
              Writers:
            </p>

            <div className="space-x-2 flex">
              {writers.map((w) => {
                return (
                  <p
                    key={w.id}
                    className="text-primary dark:text-white hover:underline cursor-pointer"
                  >
                    {w.name}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="flex ">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">
              Cast:
            </p>

            <div className="space-x-2 flex">
              {cast.map((c) => {
                return c.leadActor ? (
                  <p
                    key={c.profile.id}
                    className="text-primary dark:text-white hover:underline cursor-pointer"
                  >
                    {c.profile.name}
                  </p>
                ) : null;
              })}
            </div>
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Language:
            </p>
            <p className="text-primary dark:text-white  cursor-pointer">
              {language}
            </p>
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Release Date:
            </p>
            <p className="text-primary dark:text-white  cursor-pointer">
              {convertDate(releaseDate)}
            </p>
          </div>

          <div className="flex ">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold mr-2">
              Genres:
            </p>

            <div className="space-x-2 flex">
              {genres.map((g) => {
                return (
                  <p key={g} className="text-primary dark:text-white">
                    {g}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="flex space-x-2">
            <p className="text-light-subtle dark:text-dark-subtle font-semibold">
              Type:
            </p>
            <p className="text-primary dark:text-white">{type}</p>
          </div>

          <div className="mt-5">
            <h1 className="text-light-subtle dark:text-dark-subtle font-semibold text-2xl mb-2">
              Cast :
            </h1>
            <div className=" grid grid-cols-12">
              {cast.map((c) => {
                return (
                  <div key={c.profile.id} className="">
                    <img
                      className="w-20 h-20 aspect-square object-cover rounded-full"
                      src={c.profile.avatar}
                      alt=""
                    />
                    <div className="text-center">
                      <p className="text-primary dark:text-white hover:underline cursor-pointer">
                        {c.profile.name}
                      </p>
                      <span className="text-primary dark:text-white">as</span>
                      <p className="text-primary dark:text-white ">
                        {c.roleAs}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <RelatedMovies movie={movieId} />
      </Container>

      <AddRatingModal
        visible={showRatingModal}
        onClose={hideRatingModal}
        onSuccess={handleOnRatingSuccess}
      />
    </div>
  );
}
