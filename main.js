async function fetchBooksData() {
  try {
    const response = await fetch("data/books.json");
    const { books } = await response.json();
    return books;
  } catch (error) {
    console.error("Error fetching books data:", error);
    return [];
  }
}

function displayBooks(books) {
  const displayArea = document.querySelector(".data-vizualization");

  const bookList = document.createElement("ul");
  bookList.style.listStyle = "none";
  bookList.style.padding = "0";

  for (const { title, author, genre, year, rating, price } of books) {
    const listItem = document.createElement("li");
    listItem.style.marginBottom = "10px";
    listItem.style.padding = "10px";
    listItem.style.border = "1px solid #ddd";
    listItem.style.borderRadius = "4px";

    listItem.innerHTML = `
      <h3>${title}</h3>
      <p>Author: ${author}</p>
      <p>Genre: ${genre} | Year: ${year}</p>
      <p>Rating: ${rating} | Price: $${price}</p>
    `;
    bookList.appendChild(listItem);
  }

  displayArea.innerHTML = "";
  displayArea.appendChild(bookList);
}

function filterBooks(books, searchTerm) {
  return books.filter(({ title, author }) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      title.toLowerCase().includes(searchLower) ||
      author.toLowerCase().includes(searchLower)
    );
  });
}

function filterByGenre(books, genre) {
  if (genre === "all") return books;
  return books.filter((book) => book.genre === genre);
}

function sortBooks(books, sortBy) {
  if (sortBy === "default") return books;

  return [...books].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "year":
        return b.year - a.year;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
}

function populateGenreDropdown(books) {
  const genres = [...new Set(books.map((book) => book.genre))];
  const genreSelect = document.getElementById("genre-select");

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  });
}

function calculateStatistics(books) {
  const totalBooks = document.querySelector(".total-books");
  const averageRating = document.querySelector(".average-rating");
  const averagePagesCont = document.querySelector(".average-pages");

  totalBooks.innerHTML = "";
  averageRating.innerHTML = "";
  averagePagesCont.innerHTML = "";

  const totalItems = books.length;
  const total = document.createElement("p");
  total.textContent = `Total Books: ${totalItems}`;
  totalBooks.appendChild(total);

  const bookRates = books.map((book) => book.rating);
  const averageRate = bookRates.reduce((a, b) => a + b, 0) / totalItems;
  const average = document.createElement("p");
  average.textContent = `Average Rating: ${averageRate.toFixed(2)}`;
  averageRating.appendChild(average);

  const bookPages = books.map((book) => book.pages);
  const averagePages = bookPages.reduce((a, b) => a + b, 0) / totalItems;
  const averagePagesText = document.createElement("p");
  averagePagesText.textContent = `Average Pages: ${averagePages.toFixed(0)}`;
  averagePagesCont.appendChild(averagePagesText);
}

function calculateGenreDistribution(books) {
  const genreDistribution = document.querySelector(".books-genre");
  genreDistribution.innerHTML = "";

  const genreCounts = books.reduce((acc, book) => {
    if (acc[book.genre]) {
      acc[book.genre] += 1;
    } else {
      acc[book.genre] = 1;
    }
    return acc;
  }, {});

  const sortedGenres = Object.entries(genreCounts).sort(
    ([, a], [, b]) => b - a
  );

  sortedGenres.forEach(([genre, count]) => {
    const barContainer = document.createElement("div");
    barContainer.style.position = "relative";
    barContainer.style.marginBottom = "5px";

    const chart = document.createElement("div");
    chart.style.width = `${count * 20}px`;
    chart.style.height = "20px";
    chart.style.backgroundColor = "#3498db";
    chart.style.cursor = "pointer";

    const info = document.createElement("div");
    info.style.position = "absolute";
    info.style.left = "0";
    info.style.top = "0";
    info.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    info.style.color = "white";
    info.style.padding = "2px 5px";
    info.style.display = "none";
    info.textContent = `${genre}: ${count} books`;

    barContainer.appendChild(chart);
    barContainer.appendChild(info);

    barContainer.addEventListener("mouseenter", () => {
      info.style.display = "block";
    });

    barContainer.addEventListener("mouseleave", () => {
      info.style.display = "none";
    });

    genreDistribution.appendChild(barContainer);
  });
}

function findHighestLowestRated(books) {
  const booksCentury = document.querySelector(".book-ratings");
  booksCentury.innerHTML = "";

  const sortedByRating = [...books].sort((a, b) => b.rating - a.rating);

  const highestRating = sortedByRating[0].rating;
  const highestRatedBooks = books.filter(
    (book) => book.rating === highestRating
  );

  const lowestRating = sortedByRating[sortedByRating.length - 1].rating;
  const lowestRatedBooks = books.filter((book) => book.rating === lowestRating);

  const highestSection = document.createElement("div");
  const highestTitle = document.createElement("h4");
  highestTitle.textContent = `Highest Rated (${highestRating}):`;
  highestSection.appendChild(highestTitle);

  highestRatedBooks.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.textContent = `${book.title} by ${book.author}`;
    highestSection.appendChild(bookDiv);
  });

  const lowestSection = document.createElement("div");
  const lowestTitle = document.createElement("h4");
  lowestTitle.textContent = `Lowest Rated (${lowestRating}):`;
  lowestSection.appendChild(lowestTitle);

  lowestRatedBooks.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.textContent = `${book.title} by ${book.author}`;
    lowestSection.appendChild(bookDiv);
  });

  booksCentury.appendChild(highestSection);
  booksCentury.appendChild(lowestSection);
}

async function main() {
  const books = await fetchBooksData();

  displayBooks(books);
  populateGenreDropdown(books);
  calculateStatistics(books);
  calculateGenreDistribution(books);
  findHighestLowestRated(books);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const filtered = filterBooks(books, e.target.value);
    displayBooks(filtered);
    calculateStatistics(filtered);
  });

  const genreSelect = document.getElementById("genre-select");
  genreSelect.addEventListener("change", (e) => {
    const filteredByGenre = filterByGenre(books, e.target.value);
    displayBooks(filteredByGenre);
    calculateStatistics(filteredByGenre);
    findHighestLowestRated(filteredByGenre);
  });

  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (e) => {
    const sorted = sortBooks(books, e.target.value);
    displayBooks(sorted);
  });
}

main();
