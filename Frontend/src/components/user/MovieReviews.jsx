import React, { useEffect, useState } from "react";
import Container from "../Container";
import CustomButtonLink from "../CustomButtonLink";
import RatingStar from "../RatingStar";
import { useParams } from "react-router-dom";
import { deleteReview, getReviewByMovie } from "../../api/review";
import { useAuth, useNotification } from "../../hooks";

import { BsTrash, BsPencilSquare } from "react-icons/bs";
import ConfirmModal from "../modals/ConfirmModal";
import NotFoundText from "../NotFoundText";
import EditRatingModal from "../modals/EditRatingModal";

const getNameInitial = (name = "") => {
  return name[0].toUpperCase();
};

export default function MovieReviews() {
  const [reviews, setReviews] = useState([]);
  const [movieTitle, setMovieTitle] = useState("");
  const [profileOwnersReview, setProfileOwnersReview] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const { movieId } = useParams();
  const { authInfo } = useAuth();
  const profileId = authInfo.profile?.id;

  const { updateNotification } = useNotification();

  const fetchReviews = async () => {
    const { movie, error } = await getReviewByMovie(movieId);
    if (error) return updateNotification("error", error);

    setReviews([...movie.reviews]);
    setMovieTitle(movie.title);
  };

  //if there is  already  review we reset this value otherwise we are going to find this owners reviews from inside the reviews with find method and here we find the review and we matched this with the profile id
  const findProfileOwnersReview = () => {
    if (profileOwnersReview) return setProfileOwnersReview(null);

    const matched = reviews.find((review) => review.owner.id === profileId);
    if (!matched)
      return updateNotification("error", "you don't have any review");

    setProfileOwnersReview(matched);
  };

  const handleOnEditClick = () => {
    const { id, content, rating } = profileOwnersReview;
    setSelectedReview({
      id,
      content,
      rating,
    });
    setShowEditModal(true);
  };

  // console.log(profileOwnersReview)

  const handleDeleteConfirm = async () => {
    setBusy(true);
    const { error, message } = await deleteReview(profileOwnersReview.id);
    setBusy(false);
    if (error) return updateNotification("error", error);

    updateNotification("success", message);

    const updatedReviews = reviews.filter(
      (r) => r.id !== profileOwnersReview.id
    );
    setReviews([...updatedReviews]);
    setProfileOwnersReview(null);
    hideConfirmModal();
  };

  const handleOnReviewUpdate = (review) => {
    const updatedReview = {
      ...profileOwnersReview,
      rating: review.rating,
      content: review.content,
    };

    setProfileOwnersReview({ ...updatedReview });

    const newReviews = reviews.map((r) => {
      if (r.id === updatedReview.id) return updatedReview;
      return r;
    });
    setReviews([...newReviews]);
  };

  const displayConfirmModal = () => setShowConfirmModal(true);
  const hideConfirmModal = () => setShowConfirmModal(false);
  const hideEditModal = () => {
    setShowEditModal(false);
    setSelectedReview(null);
  };

  useEffect(() => {
    if (movieId) fetchReviews();
  }, [movieId]);

  return (
    <div className="dark:bg-danger bg-white min-h-screen pb-10">
      <Container className="xl:px-0 px-2 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font font-semibold dark:text-white text-secondary">
            Reviews for: {movieTitle}
          </h1>

          {/* we are firing this method when we are push this button */}
          {profileId ? (
            <CustomButtonLink
              label={profileOwnersReview ? "view all" : "find My review"}
              onClick={findProfileOwnersReview}
            />
          ) : null}
        </div>
        {/* 
        if there is profile owners review we render the review card otherwise we render the entire reviews */}
        {profileOwnersReview ? (
          <div>
            <ReviewCard review={profileOwnersReview} />
            <div className="flex space-x-3 dark:text-white text-primary text-xl p-3">
              <button onClick={displayConfirmModal} type="button">
                <BsTrash />
              </button>
              <button onClick={handleOnEditClick} type="button">
                <BsPencilSquare />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 mt-3">
            {reviews.map((review) => (
              <ReviewCard review={review} key={review.id} />
            ))}
          </div>
        )}
      </Container>

      <ConfirmModal
        visible={showConfirmModal}
        onCancel={hideConfirmModal}
        onConfirm={handleDeleteConfirm}
        busy={busy}
        title="are you sure?"
        subTitle="this action will remove review"
      />

      <EditRatingModal
        visible={showEditModal}
        initialState={selectedReview}
        onSuccess={handleOnReviewUpdate}
        onClose={hideEditModal}
      />
    </div>
  );
}

const ReviewCard = ({ review }) => {
  if (!review) return null;

  const { owner, content, rating } = review;
  return (
    <div className="flex space-x-3">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-light-subtle dark:bg-dark-subtle text-white text-xl select-none">
        {getNameInitial(owner.name)}
      </div>
      <div>
        <h1 className="dark:text-white text-secondary font-semibold text-lg">
          {owner.name}
        </h1>
        <RatingStar rating={rating} />
        <p className="text-light-subtle dark:text-dark-subtle">{content}</p>
      </div>
    </div>
  );
};
