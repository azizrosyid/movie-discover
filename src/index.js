import "bootstrap/dist/css/bootstrap.min.css";
const $ = require("jquery");
window.$ = $;
import "popper.js/dist/umd/popper.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "regenerator-runtime";

import "./script/css/style.css";
import icon from "./assets/image/LogoMovieDiscover.png";
import Swiper from "swiper";
import style from "swiper/swiper-bundle.css";
style // fake use

import "./script/component/CarouselHome.js";
import "./script/component/TrendingCard.js";
import "./script/component/CardMovie.js";

const main = async () => {
  // memasang favicon di html
  addFavicon(icon);

  // memasang image icon di html
  $(".img-icon").attr("src", icon);

  // deklarasi variable untuk menampung data movie
  const movie = {};

  // type type movie
  const movieType = [
    "trending",
    "now_playing",
    "popular",
    "top_rated",
    "upcoming",
  ];

  // fetch genre film
  const movieGenre = {};
  const fetchGenreMovie = await fetch(
    "https://api.themoviedb.org/3/genre/movie/list?api_key=632a128d1d6186a49825582174c7a6fa&language=en-US"
  )
    .then((res) => res.json())
    .then((res) => res.genres);
  fetchGenreMovie.map((data) => {
    movieGenre[data.id] = data.name;
  });

  // fetch semua jenis movie
  const fetchAllMovie = await Promise.all(
    movieType.map((type, index) =>
      fetch(
        `https://api.themoviedb.org/3/${
          index ? "movie/" + type : type + "/movie/week"
        }?api_key=632a128d1d6186a49825582174c7a6fa&language=en-US&page=1`
      ).then((results) => results.json())
    )
  );

  // memindahkan hasil fetch ke variabel movie
  fetchAllMovie.map((data, index) => {
    movie[movieType[index]] = data.results;
  });

  const { now_playing, trending } = movie;
  // memasang data now_playing movie ke carousel home
  now_playing.map((data, index) => {
    const { title, backdrop_path, genre_ids } = data;
    // jika tidak ada backdrop, maka di skip
    if (!backdrop_path) return;

    // membuat listGenre
    const listGenre = genre_ids.map((data) => {
      return "<span>" + movieGenre[data] + "</span>";
    });

    // membuat custom-element carousel
    const carousel = document.createElement("carousel-home");
    carousel.setData = { index, title, backdrop_path, listGenre };

    // memasang ke carousel home bootstrap
    $(".carousel-inner").append(carousel);
  });
  delete movie.now_playing;

  // memasang data trending movie ke carousel trending
  trending.map((data) => {
    const { poster_path, id } = data;
    // membuat custom-element trending card
    const trendingCard = document.createElement("trending-card");
    trendingCard.setData = { poster_path, id };

    // memasang ke carousel swiper (3rd party package)
    $(".swiper-wrapper").append(trendingCard);
  });
  delete movie.trending;

  // membuat carousel dengan package Swiper
  const swiper = new Swiper(".swiper-container", {
    slidesPerView: 1,
    centeredSlides: true,
    spaceBetween: 10,
    grabCursor: true,
    slidesPerGroup: 1,
    loop: true,
    loopFillGroupWithBlank: false,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    breakpoints: {
      540: {
        slidesPerView: 2,
        spaceBetween: 10,
      },
      720: {
        slidesPerView: 3,
        spaceBetween: 20,
      },
      960: {
        slidesPerView: 4,
        spaceBetween: 20,
      },
      1140: {
        slidesPerView: 5,
        spaceBetween: 30,
      },
    },
  });
  // menggabungkan semua data movie, meremove duplicate, dan mengacak data
  let movieAll = [];
  Object.keys(movie).forEach((key) => {
    movieAll.push(...movie[key]);
    movieAll = shuffleArray(removeDuplicate("id", movieAll));
  });

  // memasang data semua movie ke card movie
  movieAll.map((data) => {
    let { poster_path, title, genre_ids, id } = data;
    const listGenre = genre_ids.map((data) => {
      return '<span class="genre-movie">' + movieGenre[data] + "</span>";
    });
    if (poster_path && title) {
      // membuat custome element
      const cardMovie = document.createElement("card-movie");
      cardMovie.setData = { poster_path, title, listGenre, id };

      // memasang ke html
      $(".list-movie .row").append(cardMovie);
    }
  });

  // menambah event click di button tipe movie
  $(".btn-type").click(function () {
    // untuk mengganti button yang active
    $(".btn-type").removeClass("btn-active");
    $(this).addClass("btn-active");

    // menghapus seluruh child list-movie
    $(".list-movie .row").empty();

    // mengambil type movie
    const type = $(this).data("type");

    // memilih array berdasarkan type
    const arrayForLoop = type === "all" ? movieAll : movie[type];

    // looping array
    arrayForLoop.map((data) => {
      let { poster_path, title, genre_ids, id } = data;
      const listGenre = genre_ids.map((data) => {
        return '<span class="genre-movie">' + movieGenre[data] + "</span>";
      });
      if (poster_path && title) {
        // membuat custome element
        const cardMovie = document.createElement("card-movie");
        cardMovie.setData = { poster_path, title, listGenre, id };

        // memasang custom element
        $(".list-movie .row").append(cardMovie);
      }
    });
  });

  // menampilkan modal saat mengeclick card
  $(".trending-card,.card-movie,.type-control").mousemove(function () {
    $(".trending-card,.card-movie")
      .off("click")
      .click(async function () {
        const movieId = $(this).data("movieId");
        await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=632a128d1d6186a49825582174c7a6fa&language=en-US`
        )
          .then((res) => res.json())
          .then((res) => {
            const {
              overview,
              title,
              genres,
              homepage,
              poster_path,
              production_companies,
              spoken_languages,
              imdb_id,
            } = res;
            const language = spoken_languages.map((data) => data.name);
            const genre = genres.map((data) => data.name);
            const company = production_companies.map((data) => data.name);
            const html = `
          <div class="col-3 image-modal">
          <img
          src="https://image.tmdb.org/t/p/original${poster_path}"
          class="d-block w-100"
        />
          </div>
          <div class="col-9">
          <table class="table">
        <tr>
          <td>Genre: </td>
          <td>${genre.join(", ")}</td>
        </tr>
        <tr>
          <td>Overview:</td>
          <td>
            ${overview}
          </td>
        </tr>
        <tr>
          <td>Production:</td>
          <td>
            ${company.join(", ")}
          </td>
        </tr>
        <tr>
          <td>Language:</td>
          <td>${language.join(", ")}</td>
        </tr>
        <tr>
          <td>More Info:</td>
          <td>
            ${homepage ? '<a href="' + homepage + '">Official Website</a>' : ""}
            <a href="https://www.imdb.com/title/${imdb_id}/"
              >IMDb Website</a
            >
          </td>
        </tr>
        </table>
        </div>
        `;
            $(".modal-title").text(title);
            $(".modal-body .row").html(html);
          });
        $(".detail-movie").modal("show");
      });
  });
};

// function untuk menghapus data duplikat
function removeDuplicate(compare, obj) {
  const temp = [];
  const filtered = obj.filter((data) => {
    if (temp.includes(data[compare])) {
      return false;
    } else {
      temp.push(data[compare]);
      return true;
    }
  });
  return filtered;
}

// function untuk mengacak array
function shuffleArray(array) {
  var count = array.length,
    randomnumber,
    temp;
  while (count) {
    randomnumber = (Math.random() * count--) | 0;
    temp = array[count];
    array[count] = array[randomnumber];
    array[randomnumber] = temp;
  }
  return array;
}

// function untuk memasang favicon
function addFavicon(icon) {
  const link = document.createElement("link");
  link.rel = "shortcut icon";
  link.href = icon;
  document.head.appendChild(link);
}

main();
