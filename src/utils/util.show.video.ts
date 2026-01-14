  export const videoUrl = (url: string) => {
    switch (url) {
      case "/projeto":
        return "/project.mp4";
      case "/pacto":
        return "/pacto.mp4";
      case "/artigo":
        return "/article.mp4";
      case "/":
        return "/gallery.mp4";
      default:
        return "";
    }
  }