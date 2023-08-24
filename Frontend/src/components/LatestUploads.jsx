import React, { useEffect, useState } from "react";
import MovieListItem from "./MovieListItem";
import { deleteMovie, getMovieForUpdate, getMovies } from "../api/movie";
import { useMovies, useNotification } from "../hooks";
import ConfirmModal from "./modals/ConfirmModal";
import UpdateMovie from "./modals/UpdateMovie";

const pageNo = 0;
const limit = 5;

//styling of uploads in dashboard
export default function LatestUploads() {
  const [movies, setMovies] = useState([]);
  // const [showConfirmModal, setShowConfirmModal] = useState(false);
  // const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [selectedMovie, setSelectedMovie] = useState(false);
  // const [busy, setBusy] = useState(false);

  const { updateNotification } = useNotification();
  const {fetchLatestUploads , latestUploads} = useMovies()

  // const fetchLatestUploads = async () => {
  //   const { error, movies } = await getMovies(pageNo, limit);
  //   if (error) return updateNotification("error", error);

  //   setMovies([...movies]);
  // };

  // const handleOnDeleteClick = (movie) => {
  //   setSelectedMovie(movie);
  //   setShowConfirmModal(true);
  // };

  // const handleOnEditClick = async ({ id }) => {
  //   const { movie, error } = await getMovieForUpdate(id);
  //   setShowUpdateModal(true);

  //   if (error) return updateNotification("error", error);

  //   setSelectedMovie(movie);
  // };

  // const handleOnDeleteConfirm = async () => {
  //   setBusy(true);
  //   const { error, message } = await deleteMovie(selectedMovie.id);
  //   setBusy(false);

  //   if (error) return updateNotification("error", error);
  //   updateNotification("success", message);
  //   fetchLatestUploads();
  //   hideConfirmModal();
  // };

  // const handleOnUpdate = (movie) => {
  //   const updatedMovies = movies.map((m) => {
  //     if (m.id === movie.id) return movie;
  //     return m;
  //   });

  //   setMovies([...updatedMovies]);
  // };

  // const hideConfirmModal = () => {
  //   setShowConfirmModal(false);
  // };

  // const hideUpdateModal = () => {
  //   setShowUpdateModal(false);
  // };

  const handleUIUpdate = () => fetchLatestUploads();

  useEffect(() => {
    fetchLatestUploads();
  }, []);

  return (
    <>
      <div className="bg-white shadow dark:shadow dark:bg-secondary p-5 rounded col-span-2">
        <h1 className="font-semibold text-2xl mb-2 text-primary dark:text-white">
          Recent Uploads
        </h1>

        {latestUploads.map((movie) => {
          return (
            <MovieListItem
              movie={movie}
              key={movie.id}
              // onDeleteClick={() => handleOnDeleteClick(movie)}
              // onEditClick={() => handleOnEditClick(movie)}.
              afterDelete={handleUIUpdate}
              afterUpdate={handleUIUpdate}
            />
          );
        })}
      </div>
      {/* <ConfirmModal
        title="are you sure?"
        subTitle="this action will remove this movie!"
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleOnDeleteConfirm}
        busy={busy}
      />

      <UpdateMovie
        visible={showUpdateModal}
        onClose={hideUpdateModal}
        initialState={selectedMovie}
        onSuccess={handleOnUpdate}
      /> */}
    </>
  );
}
