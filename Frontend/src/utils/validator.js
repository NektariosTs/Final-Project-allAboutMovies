 export const validateMovie = (movieInfo) => {
    const {
      title,
      storyLine,
      language,
      releaseDate,
      status,
      type,
      genres,
      tags,
      cast,
    } = movieInfo;
  
    //validation logic for movie
    if (!title.trim()) return { error: "title is missing" };
    if (!storyLine.trim()) return { error: "storyLine is missing" };
    if (!language.trim()) return { error: "language is missing" };
    if (!releaseDate.trim()) return { error: "release date is missing" };
    if (!status.trim()) return { error: "status is missing" };
    if (!type.trim()) return { error: "type is missing" };
    //validation for genres we are cheking if genres is an array or not
    if (!genres.length) return { error: "genres is missing" };
    //we are checking genres needs to field with string value
    for (let gen of genres) {
      if (!gen.trim()) return { error: "invalid genres" };
    }
  
    //validation for tags we are cheking if genres is an array or not
    if (!tags.length) return { error: "tags is missing" };
    //we are checking genres needs to field with string value
    for (let tag of tags) {
      if (!tag.trim()) return { error: "invalid tags" };
    }
  
    //validation for cast we are cheking if genres is an array or not
    if (!cast.length) return { error: "cast is missing" };
    //we are checking cast needs to field with string value
    for (let c of cast) {
      if (typeof c !== "object") return { error: "invalid cast" };
    }
  
    return { error: null };
  };