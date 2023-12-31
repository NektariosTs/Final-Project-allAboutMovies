import React from "react";
import Container from "./Container";
import NotVerified from "./user/NotVerified";
import TopRatedMovies from "./user/TopRatedMovies";
import TopRatedWebSeries from "./user/TopRatedWebSeries";
import TopRatedTVSeries from "./user/TopRatedTVSeries";
import HeroSlidShow from "./user/HeroSlidShow";

export default function Home() {
  return (
    <div className="dark:bg-danger bg-white min-h-screen">
      <Container className="px-2 xl:p-0">
        <NotVerified />
        {/* slider */}
        <HeroSlidShow />
        {/* Most rated movies */}
        <div className="space-y-3 py-8">
        <TopRatedMovies />
        <TopRatedWebSeries />
        <TopRatedTVSeries />
        </div>
      </Container>
    </div>
  );
}
