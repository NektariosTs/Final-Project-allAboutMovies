import React, { useEffect, useRef, useState, forwardRef } from "react";
import { getLatestUploads } from "../../api/movie";
import { useNotification } from "../../hooks";
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";

let count = 0;
let intervalId;

let newTime = 0;
let lastTime = 0;

export default function HeroSlidShow() {
  const [currentSlide, setCurrentSlide] = useState({});
  const [slides, setSlides] = useState([]);
  const [upNext, setUpNext] = useState([]);
  const [visible, setVisible] = useState(true);
  const [clonedSlide, setCloneSlide] = useState({});

  const slideRef = useRef();
  const clonedSlideRef = useRef();

  const updateNotification = useNotification();

  const fetchLatestUploads = async () => {
    const { error, movies } = await getLatestUploads();
    if (error) return updateNotification("error", error);

    setSlides([...movies]);
    setCurrentSlide(movies[0]);
  };

  const startSlideShow = () => {
    intervalId = setInterval(() => {
      newTime = Date.now();
      const delta = newTime - lastTime;
      if (delta < 4000) return clearInterval(intervalId);
      handleOnNextClick();
    }, 3500);
  };

  const pauseSlideShow = () => {
    clearInterval(intervalId);
  };
  // we are accepting the current index which will be the count we are going to this 1 because we want to update the next slide and this will give us the the first value and we want to rendr the three slides
  const updateUpNext = (currentIndex) => {
    if (!slides.length) return;

    const upNextCount = currentIndex + 1;
    const end = upNextCount + 3;

    let newSlides = [...slides];
    newSlides = newSlides.slice(upNextCount, end);

    if (!newSlides.length) {
      newSlides = [...slides].slice(0, 3);
    }

    setUpNext([...newSlides]);
  };

  //functionality for the next slide
  //so here we made a loop that we increase the count of the slides for the next button with +1
  const handleOnNextClick = () => {
    lastTime = Date.now();
    pauseSlideShow();
    setCloneSlide(slides[count]);
    count = (count + 1) % slides.length;
    setCurrentSlide(slides[count]);

    clonedSlideRef.current.classList.add("slide-out-to-left");
    slideRef.current.classList.add("slide-in-from-right");
    updateUpNext(count);
  };

  //functionality for the previous slide
  //so here we made a loop that we decrease the count of the slides for the next button with -1
  const handleOnPreviousClick = () => {
    pauseSlideShow();
    setCloneSlide(slides[count]);
    count = (count + slides.length - 1) % slides.length;
    setCurrentSlide(slides[count]);

    clonedSlideRef.current.classList.add("slide-out-to-right");
    slideRef.current.classList.add("slide-in-from-left");
    updateUpNext(count);
  };

  const handleAnimationEnd = () => {
    const classes = [
      "slide-out-to-left",
      "slide-in-from-right",
      "slide-out-to-right",
      "slide-in-from-left",
    ];
    slideRef.current.classList.remove(...classes);
    clonedSlideRef.current.classList.remove(...classes);
    setCloneSlide({});
    startSlideShow();
  };

  const handleVisibilityChange = () => {
    const visibility = document.visibilityState;
    if (visibility === "hidden") setVisible(false);
    if (visibility === "visible") setVisible(true);
  };

  useEffect(() => {
    fetchLatestUploads();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      //for auto slide
      pauseSlideShow();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (slides.length && visible) {
      startSlideShow();
      updateUpNext(count);
    } else pauseSlideShow();
  }, [slides.length, visible]); //auto slide

  return (
    <div className="w-full flex">
      {/*Slide show section */}
      <div className="md:w-4/5 w-full aspect-video relative overflow-hidden">
        {/* current slide */}
        <Slide
          ref={slideRef}
          title={currentSlide.title}
          src={currentSlide.poster}
          id={currentSlide.id}
        />

        {/* clone slide*/}
        <Slide
          onAnimationEnd={handleAnimationEnd}
          ref={clonedSlideRef}
          className="absolute inset-0"
          src={clonedSlide.poster}
          title={clonedSlide.title}
          id={currentSlide.id}
        />

        <SlideShowController
          onNextClick={handleOnNextClick}
          onPreviousClick={handleOnPreviousClick}
        />
      </div>

      {/*up next section */}
      <div className="w-1/5 md:block hidden space-y-3 px-3">
        <h1 className="font-semibold text-2xl text-primary dark:text-white">
          Up next
        </h1>
        {upNext.map(({ poster, id }) => {
          return (
            <img
              key={id}
              src={poster}
              alt=""
              className="aspect-video object-cover rounded"
            />
          );
        })}
      </div>
    </div>
  );
}

const SlideShowController = ({ onNextClick, onPreviousClick }) => {
  const buttonClass =
    "bg-primary rounded border-2 text-white text-xl p-2 outline-none";
  return (
    <div className="absolute top-1/2 -translate-y-1/2 w-full flex items-center justify-between px-2">
      <button onClick={onPreviousClick} className={buttonClass} type="button">
        <BsFillArrowLeftCircleFill />
      </button>
      <button onClick={onNextClick} className={buttonClass} type="button">
        <BsFillArrowRightCircleFill />
      </button>
    </div>
  );
};

const Slide = forwardRef((props, ref) => {
  const { id, title, src, className = "", ...rest } = props;
  return (
    <Link
      to={"/movie/" + id}
      ref={ref}
      className={"w-full cursor-pointer block " + className}
      {...rest}
    >
      <img className="aspect-video object-cover" src={src} alt="" />
      <div className="absolute inset-0 flex flex-col justify-end py-3 ">
        <h1 className="font-serif text-4xl dark:text-white text-white">
          {title}
        </h1>
      </div>
    </Link>
  );
});
