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

function createBookSummaries(books) {
  return books.map(({ title, author, rating, price, genre, year }) => ({
    title,
    author,
    rating,
    price,
    genre,
    year,
    summary: `${title} by ${author} (${year})`,
    priceCategory: price > 25 ? 'Premium' : price > 15 ? 'Standard' : 'Budget',
    ratingCategory: rating >= 4.5 ? 'Excellent' : rating >= 4.0 ? 'Good' : rating >= 3.5 ? 'Average' : 'Below Average',
    ageCategory: year >= 2010 ? 'Recent' : year >= 1990 ? 'Modern' : 'Classic'
  }));
}

function createGenreSummaries(books) {
  const genreGroups = books.reduce((acc, book) => {
    if (!acc[book.genre]) {
      acc[book.genre] = [];
    }
    acc[book.genre].push(book);
    return acc;
  }, {});

  return Object.entries(genreGroups).map(([genre, genreBooks]) => {
    const totalBooks = genreBooks.length;
    const averageRating = genreBooks.reduce((sum, book) => sum + book.rating, 0) / totalBooks;
    const averagePrice = genreBooks.reduce((sum, book) => sum + book.price, 0) / totalBooks;
    const totalValue = genreBooks.reduce((sum, book) => sum + book.price, 0);
    
    return {
      genre,
      totalBooks,
      averageRating: parseFloat(averageRating.toFixed(2)),
      averagePrice: parseFloat(averagePrice.toFixed(2)),
      totalValue: parseFloat(totalValue.toFixed(2)),
      topRatedBook: genreBooks.reduce((max, book) => book.rating > max.rating ? book : max),
      priceRange: {
        min: Math.min(...genreBooks.map(book => book.price)),
        max: Math.max(...genreBooks.map(book => book.price))
      }
    };
  });
}

function createPriceAnalysis(books) {
  const priceRanges = [
    { label: 'Budget (Under $15)', min: 0, max: 15 },
    { label: 'Standard ($15-$25)', min: 15, max: 25 },
    { label: 'Premium ($25-$35)', min: 25, max: 35 },
    { label: 'Luxury (Over $35)', min: 35, max: Infinity }
  ];

  return priceRanges.map(({ label, min, max }) => {
    const booksInRange = books.filter(book => book.price >= min && book.price < max);
    const averageRating = booksInRange.length > 0 
      ? booksInRange.reduce((sum, book) => sum + book.rating, 0) / booksInRange.length 
      : 0;
    
    return {
      category: label,
      count: booksInRange.length,
      percentage: parseFloat(((booksInRange.length / books.length) * 100).toFixed(1)),
      averageRating: parseFloat(averageRating.toFixed(2)),
      books: booksInRange.map(book => ({ title: book.title, price: book.price, rating: book.rating }))
    };
  });
}

function displaySummaryCards(books) {
  const summaryContainer = document.querySelector('.summary-cards');
  summaryContainer.innerHTML = '';

  const bookSummaries = createBookSummaries(books);
  const genreSummaries = createGenreSummaries(books);
  const priceAnalysis = createPriceAnalysis(books);

  const cardsContainer = document.createElement('div');
  cardsContainer.className = 'cards-container';


  const genreCard = document.createElement('div');
  genreCard.className = 'summary-card genre-card';
  
  const genreTitle = document.createElement('h3');
  genreTitle.className = 'card-title';
  genreTitle.textContent = 'Genre Analysis';
  genreCard.appendChild(genreTitle);

  genreSummaries.forEach(({ genre, totalBooks, averageRating, averagePrice, topRatedBook }) => {
    const genreDiv = document.createElement('div');
    genreDiv.className = 'card-item';
    genreDiv.innerHTML = `
      <strong>${genre}</strong><br>
      Books: ${totalBooks} | Avg Rating: ${averageRating} | Avg Price: $${averagePrice}<br>
      <em>Top: ${topRatedBook.title} (${topRatedBook.rating}★)</em>
    `;
    genreCard.appendChild(genreDiv);
  });


  const priceCard = document.createElement('div');
  priceCard.className = 'summary-card price-card';
  
  const priceTitle = document.createElement('h3');
  priceTitle.className = 'card-title';
  priceTitle.textContent = 'Price Distribution';
  priceCard.appendChild(priceTitle);

  priceAnalysis.forEach(({ category, count, percentage, averageRating }) => {
    const priceDiv = document.createElement('div');
    priceDiv.className = 'card-item';
    priceDiv.innerHTML = `
      <strong>${category}</strong><br>
      ${count} books (${percentage}%) | Avg Rating: ${averageRating}★
    `;
    priceCard.appendChild(priceDiv);
  });


  const categoriesCard = document.createElement('div');
  categoriesCard.className = 'summary-card categories-card';
  
  const categoriesTitle = document.createElement('h3');
  categoriesTitle.className = 'card-title';
  categoriesTitle.textContent = 'Book Categories';
  categoriesCard.appendChild(categoriesTitle);

  const ratingCategories = ['Excellent', 'Good', 'Average', 'Below Average'];

  ratingCategories.forEach(category => {
    const categoryBooks = bookSummaries.filter(book => book.ratingCategory === category);
    if (categoryBooks.length > 0) {
      const categoryDiv = document.createElement('div');
      categoryDiv.className = 'card-item';
      categoryDiv.innerHTML = `<strong>${category} Books:</strong> ${categoryBooks.length}`;
      categoriesCard.appendChild(categoryDiv);
    }
  });

  const statsCard = document.createElement('div');
  statsCard.className = 'summary-card stats-card';
  
  const statsTitle = document.createElement('h3');
  statsTitle.className = 'card-title';
  statsTitle.textContent = 'Quick Stats';
  statsCard.appendChild(statsTitle);

  const totalValue = books.reduce((sum, book) => sum + book.price, 0);
  const averagePages = books.reduce((sum, book) => sum + book.pages, 0) / books.length;
  const recentBooks = bookSummaries.filter(book => book.ageCategory === 'Recent').length;
  const excellentBooks = bookSummaries.filter(book => book.ratingCategory === 'Excellent').length;

  const quickStats = [
    `Total Collection Value: $${totalValue.toFixed(2)}`,
    `Average Pages: ${Math.round(averagePages)}`,
    `Recent Books (2010+): ${recentBooks}`,
    `Excellent Rated (4.5+): ${excellentBooks}`
  ];

  quickStats.forEach(stat => {
    const statDiv = document.createElement('div');
    statDiv.className = 'card-item';
    statDiv.textContent = stat;
    statsCard.appendChild(statDiv);
  });

  cardsContainer.appendChild(genreCard);
  cardsContainer.appendChild(priceCard);
  cardsContainer.appendChild(categoriesCard);
  cardsContainer.appendChild(statsCard);

  summaryContainer.appendChild(cardsContainer);
}

function validateData(books) {
  const totalSales = document.querySelector(".total-sales");
  totalSales.innerHTML = "";

  const allBooksComplete = books.every(
    (book) =>
      book.title &&
      book.author &&
      book.genre &&
      book.year &&
      book.rating !== undefined &&
      book.price !== undefined &&
      book.pages !== undefined
  );

  const allRatingsValid = books.every(
    (book) => book.rating >= 0 && book.rating <= 5
  );

  const allYearsValid = books.every(
    (book) => book.year >= 1000 && book.year <= new Date().getFullYear()
  );

  const someBooksMissingData = books.some(
    (book) =>
      !book.title ||
      !book.author ||
      !book.genre ||
      !book.year ||
      book.rating === undefined ||
      book.price === undefined ||
      book.pages === undefined
  );

  const someInvalidRatings = books.some(
    (book) => book.rating < 0 || book.rating > 5
  );

  const someExpensiveBooks = books.some((book) => book.price > 30);

  const validationTitle = document.createElement("h4");
  validationTitle.textContent = "Data Validation:";
  totalSales.appendChild(validationTitle);

  const results = [
    { label: "All books complete", status: allBooksComplete },
    { label: "All ratings valid", status: allRatingsValid },
    { label: "All years valid", status: allYearsValid },
    { label: "Some missing data", status: someBooksMissingData },
    { label: "Some invalid ratings", status: someInvalidRatings },
    { label: "Some expensive books", status: someExpensiveBooks },
  ];

  results.forEach((result) => {
    const resultDiv = document.createElement("div");
    resultDiv.textContent = `${result.label}: ${result.status ? "✓" : "✗"}`;
    resultDiv.style.color = result.status ? "green" : "red";
    totalSales.appendChild(resultDiv);
  });
}

async function main() {
  const books = await fetchBooksData();

  displayBooks(books);
  displaySummaryCards(books);
  populateGenreDropdown(books);
  calculateStatistics(books);
  calculateGenreDistribution(books);
  findHighestLowestRated(books);
  validateData(books);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const filtered = filterBooks(books, e.target.value);
    displayBooks(filtered);
    displaySummaryCards(filtered);
    calculateStatistics(filtered);
  });

  const genreSelect = document.getElementById("genre-select");
  genreSelect.addEventListener("change", (e) => {
    const filteredByGenre = filterByGenre(books, e.target.value);
    displayBooks(filteredByGenre);
    displaySummaryCards(filteredByGenre);
    calculateStatistics(filteredByGenre);
    findHighestLowestRated(filteredByGenre);
  });

  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (e) => {
    const sorted = sortBooks(books, e.target.value);
    displayBooks(sorted);
    displaySummaryCards(sorted);
  });
}

main();
