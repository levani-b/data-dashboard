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
  const chartsSection = document.querySelector(".charts-section");
  chartsSection.innerHTML = "";

  const chartsHeader = document.createElement("h2");
  chartsHeader.textContent = "Data Visualization Charts";
  chartsHeader.className = "charts-header";
  chartsSection.appendChild(chartsHeader);

  const chartsContainer = document.createElement("div");
  chartsContainer.className = "charts-container";

  const genreChartContainer = document.createElement("div");
  genreChartContainer.className = "chart-container";
  
  const genreTitle = document.createElement("h3");
  genreTitle.textContent = "Books by Genre Distribution";
  genreTitle.className = "chart-title";
  genreChartContainer.appendChild(genreTitle);

  const genreDistribution = document.createElement("div");
  genreDistribution.className = "genre-chart";

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

  const maxCount = Math.max(...Object.values(genreCounts));

  sortedGenres.forEach(([genre, count]) => {
    const barContainer = document.createElement("div");
    barContainer.className = "bar-container";

    const barLabel = document.createElement("div");
    barLabel.className = "bar-label";
    barLabel.textContent = genre;

    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const chart = document.createElement("div");
    chart.className = "bar";
    const percentage = (count / maxCount) * 100;
    chart.style.width = `${Math.max(percentage, 10)}%`;
    chart.setAttribute("data-count", count);

    const barValue = document.createElement("span");
    barValue.className = "bar-value";
    barValue.textContent = `${count} books`;

    barWrapper.appendChild(chart);
    barWrapper.appendChild(barValue);
    
    barContainer.appendChild(barLabel);
    barContainer.appendChild(barWrapper);

    genreDistribution.appendChild(barContainer);
  });

  genreChartContainer.appendChild(genreDistribution);

  const ratingChartContainer = document.createElement("div");
  ratingChartContainer.className = "chart-container";
  
  const ratingTitle = document.createElement("h3");
  ratingTitle.textContent = "Books by Rating Distribution";
  ratingTitle.className = "chart-title";
  ratingChartContainer.appendChild(ratingTitle);

  const ratingDistribution = document.createElement("div");
  ratingDistribution.className = "rating-chart";

  const ratingRanges = [
    { label: "4.5+ Stars", min: 4.5, max: 5 },
    { label: "4.0-4.4 Stars", min: 4.0, max: 4.4 },
    { label: "3.5-3.9 Stars", min: 3.5, max: 3.9 },
    { label: "3.0-3.4 Stars", min: 3.0, max: 3.4 },
    { label: "Below 3.0", min: 0, max: 2.9 }
  ];

  const ratingCounts = ratingRanges.map(range => {
    const count = books.filter(book => book.rating >= range.min && book.rating <= range.max).length;
    return { ...range, count };
  });

  const maxRatingCount = Math.max(...ratingCounts.map(r => r.count));

  ratingCounts.forEach(({ label, count }) => {
    const barContainer = document.createElement("div");
    barContainer.className = "bar-container";

    const barLabel = document.createElement("div");
    barLabel.className = "bar-label";
    barLabel.textContent = label;

    const barWrapper = document.createElement("div");
    barWrapper.className = "bar-wrapper";

    const chart = document.createElement("div");
    chart.className = "bar rating-bar";
    const percentage = maxRatingCount > 0 ? (count / maxRatingCount) * 100 : 0;
    chart.style.width = `${Math.max(percentage, 5)}%`;
    chart.setAttribute("data-count", count);

    const barValue = document.createElement("span");
    barValue.className = "bar-value";
    barValue.textContent = `${count} books`;

    barWrapper.appendChild(chart);
    barWrapper.appendChild(barValue);
    
    barContainer.appendChild(barLabel);
    barContainer.appendChild(barWrapper);

    ratingDistribution.appendChild(barContainer);
  });

  ratingChartContainer.appendChild(ratingDistribution);

  chartsContainer.appendChild(genreChartContainer);
  chartsContainer.appendChild(ratingChartContainer);
  chartsSection.appendChild(chartsContainer);
}

function findHighestLowestRated(books) {
  const highestContainer = document.querySelector(".highest-rated");
  const lowestContainer = document.querySelector(".lowest-rated");
  
  highestContainer.innerHTML = "";
  lowestContainer.innerHTML = "";

  const sortedByRating = [...books].sort((a, b) => b.rating - a.rating);

  const highestRating = sortedByRating[0].rating;
  const highestRatedBooks = books.filter(
    (book) => book.rating === highestRating
  );

  const lowestRating = sortedByRating[sortedByRating.length - 1].rating;
  const lowestRatedBooks = books.filter((book) => book.rating === lowestRating);

  const highestTitle = document.createElement("h4");
  highestTitle.textContent = `Highest Rated (${highestRating}):`;
  highestContainer.appendChild(highestTitle);

  highestRatedBooks.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.textContent = `${book.title} by ${book.author}`;
    highestContainer.appendChild(bookDiv);
  });

  const lowestTitle = document.createElement("h4");
  lowestTitle.textContent = `Lowest Rated (${lowestRating}):`;
  lowestContainer.appendChild(lowestTitle);

  lowestRatedBooks.forEach((book) => {
    const bookDiv = document.createElement("div");
    bookDiv.textContent = `${book.title} by ${book.author}`;
    lowestContainer.appendChild(bookDiv);
  });
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

  const genreContainer = document.createElement('div');
  genreContainer.className = 'genre-container';
  
  const genreCard = document.createElement('div');
  genreCard.className = 'summary-card genre-card';
  
  const genreTitle = document.createElement('h3');
  genreTitle.className = 'card-title';
  genreTitle.textContent = 'Genre Analysis';
  genreCard.appendChild(genreTitle);

  const genreGrid = document.createElement('div');
  genreGrid.className = 'genre-grid';

  genreSummaries.forEach(({ genre, totalBooks, averageRating, averagePrice, topRatedBook }) => {
    const genreDiv = document.createElement('div');
    genreDiv.className = 'card-item';
    genreDiv.innerHTML = `
      <strong>${genre}</strong><br>
      Books: ${totalBooks} | Avg Rating: ${averageRating} | Avg Price: $${averagePrice}<br>
      <em>Top: ${topRatedBook.title} (${topRatedBook.rating}★)</em>
    `;
    genreGrid.appendChild(genreDiv);
  });

  genreCard.appendChild(genreGrid);
  genreContainer.appendChild(genreCard);

  const threeCardsContainer = document.createElement('div');
  threeCardsContainer.className = 'three-cards-container';

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

  threeCardsContainer.appendChild(priceCard);
  threeCardsContainer.appendChild(categoriesCard);
  threeCardsContainer.appendChild(statsCard);

  summaryContainer.appendChild(genreContainer);
  summaryContainer.appendChild(threeCardsContainer);
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
  populateGenreDropdown(books);
  calculateStatistics(books);
  findHighestLowestRated(books);
  validateData(books);
  displaySummaryCards(books);
  calculateGenreDistribution(books);

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    const filtered = filterBooks(books, e.target.value);
    displayBooks(filtered);
    calculateStatistics(filtered);
    findHighestLowestRated(filtered);
    displaySummaryCards(filtered);
    calculateGenreDistribution(filtered);
  });

  const genreSelect = document.getElementById("genre-select");
  genreSelect.addEventListener("change", (e) => {
    const filteredByGenre = filterByGenre(books, e.target.value);
    displayBooks(filteredByGenre);
    calculateStatistics(filteredByGenre);
    findHighestLowestRated(filteredByGenre);
    displaySummaryCards(filteredByGenre);
    calculateGenreDistribution(filteredByGenre);
  });

  const sortSelect = document.getElementById("sort-select");
  sortSelect.addEventListener("change", (e) => {
    const sorted = sortBooks(books, e.target.value);
    displayBooks(sorted);
    displaySummaryCards(sorted);
    calculateGenreDistribution(sorted);
  });
}

main();
