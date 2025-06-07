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

  totalBooks.innerHTML = "";
  averageRating.innerHTML = "";

  const totalItems = books.length;
  const total = document.createElement("p");
  total.textContent = `Total Books: ${totalItems}`;
  totalBooks.appendChild(total);

  const bookRates = books.map((book) => book.rating);
  const averageRate = bookRates.reduce((a, b) => a + b, 0) / totalItems;
  const average = document.createElement("p");
  average.textContent = `Average Rating: ${averageRate.toFixed(2)}`;
  averageRating.appendChild(average);
}

async function main() {
  const books = await fetchBooksData();
  console.log(books);

  displayBooks(books);

  populateGenreDropdown(books);

  calculateStatistics(books);

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
  });

  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (e) => {
    const sorted = sortBooks(books, e.target.value);
    displayBooks(sorted);
  });
}

main();
