import React, { useEffect, useState } from "react";
import MovieListItem from "../MovieListItem";
import { getMovieForUpdate, getMovies } from "../../api/movie";
import { useMovies, useNotification } from "../../hooks";
import NextAndPreviousButton from "../NextAndPreviousButton";
import UpdateMovie from "../modals/UpdateMovie";
import ConfirmModal from "../modals/ConfirmModal";
import { deleteMovie } from "../../api/movie";

const limit = 10;
let currentPageNo = 0;

export default function Movies() {
  const [movies, setMovies] = useState([]); //we need place to store our movies
  const [reachedToEnd, setReachedToEnd] = useState(false);
  const [busy, setBusy] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const { updateNotification } = useNotification();
  const {
    fetchMovies,
    movies: newMovies,
    fetchPrevPage,
    fetchNextPage,
  } = useMovies();

  // the same thing that we do in actors pagination we made a function and inside we put the pageno as parameter
  //and we pass the function inside the useEffect
  // const fetchMovies = async (pageNo) => {
  //   const { error, movies } = await getMovies(pageNo, limit);
  //   if (error) updateNotification("error", error);

  //   //if there are no movies with the length method it means that we arrive to the end
  //   if (!movies.length) {
  //     currentPageNo = pageNo - 1;
  //     return setReachedToEnd(true);
  //   }

  //   setMovies([...movies]);
  // };

  //  const handleOnNextClick = () => {
  //    if (reachedToEnd) return;
  //    currentPageNo += 1;
  //    fetchMovies(currentPageNo);
  //  };

  //  const handleOnPreviousClick = () => {
  //   if (currentPageNo <= 0) return;
  //   if (reachedToEnd) setReachedToEnd(false);

  //   currentPageNo -= 1;
  //   fetchMovies(currentPageNo);
  //  };

  // const handleOnEditClick = async ({ id }) => {
  //   const { movie, error } = await getMovieForUpdate(id);
  //   if (error) return updateNotification("error", error);
  //   setSelectedMovie(movie);
  //   setShowUpdateModal(true);
  // };

  // const handleOnDeleteClick = (movie) => {
  //   setSelectedMovie(movie);
  //   setShowConfirmModal(true);
  // };


  // deleting movie with error messages and when deleting with returning in the current page with movies
  // const handleOnDeleteConfirm = async () => {
  //   setBusy(true);
  //   const { error, message } = await deleteMovie(selectedMovie.id);
  //   setBusy(false);
  //   if (error) return updateNotification("error", error);

  //   updateNotification("success", message);
  //   hideConfirmModal();
  //   fetchMovies(currentPageNo);
  // };

  // //we use map method because we want to map through this array and we want to create a new array
  // const handleAfterUpdate = (movie) => {
  //   const updatedMovies = movies.map((m) => {
  //     if (m.id === movie.id) return movie;
  //     return m;
  //   });

  //   setMovies([...updatedMovies]);
  // };
  // we want to close the form when we update
  // const hideUpdateForm = () => setShowUpdateModal(false);
  // const hideConfirmModal = () => setShowConfirmModal(false);

  const handleUIUpdate= () => fetchMovies();

  useEffect(() => {
    fetchMovies(currentPageNo);
  }, []);

  return (
    <>
      <div className="space-y-3 p-5">
        {newMovies.map((movie) => {
          return (
            <MovieListItem
              key={movie.id}
              movie={movie}
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
              // onEditClick={() => handleOnEditClick(movie)}
              // onDeleteClick={() => handleOnDeleteClick(movie)}
            />
          );
        })}

        <NextAndPreviousButton
          className="mt-5 gap-3"
          onNextClick={fetchNextPage}
          onPreviousClick={fetchPrevPage}
        />
      </div>

      {/* <ConfirmModal
        visible={showConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        onCancel={hideConfirmModal}
        title="Are you sure?"
        subTitle="this action will remove the movie"
        busy={busy}
      />
      <UpdateMovie
        visible={showUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
        onClose={hideUpdateForm}
      /> */}
    </>
  );
}
