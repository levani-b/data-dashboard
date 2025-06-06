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
  const displayArea = document.querySelector('.data-vizualization');
  
  const bookList = document.createElement('ul');
  bookList.style.listStyle = 'none';
  bookList.style.padding = '0';
  
  for (const { title, author, genre, year, rating, price } of books) {
    const listItem = document.createElement('li');
    listItem.style.marginBottom = '10px';
    listItem.style.padding = '10px';
    listItem.style.border = '1px solid #ddd';
    listItem.style.borderRadius = '4px';
    
    listItem.innerHTML = `
      <h3>${title}</h3>
      <p>Author: ${author}</p>
      <p>Genre: ${genre} | Year: ${year}</p>
      <p>Rating: ${rating} | Price: $${price}</p>
    `;
    bookList.appendChild(listItem);
  }
  
  displayArea.innerHTML = '';
  displayArea.appendChild(bookList);
}

function filterBooks(books, searchTerm) {
  return books.filter(({ title, author }) => {
    const searchLower = searchTerm.toLowerCase();
    return title.toLowerCase().includes(searchLower) || 
           author.toLowerCase().includes(searchLower);
  });
}

async function main() {
  const books = await fetchBooksData();
  console.log(books);
  displayBooks(books);
  
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    const filtered = filterBooks(books, e.target.value);
    displayBooks(filtered);
  });
}

main();
