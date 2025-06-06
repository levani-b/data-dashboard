async function fetchBooksData() {
  try {
    const response = await fetch("data/books.json");
    const data = await response.json();
    return data.books;
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
  
  
  for (const book of books) {
    const listItem = document.createElement('li');
    listItem.style.marginBottom = '10px';
    listItem.style.padding = '10px';
    listItem.style.border = '1px solid #ddd';
    listItem.style.borderRadius = '4px';
    
    listItem.innerHTML = `
      <h3>${book.title}</h3>
      <p>Author: ${book.author}</p>
      <p>Genre: ${book.genre} | Year: ${book.year}</p>
      <p>Rating: ${book.rating} | Price: $${book.price}</p
    `;
    bookList.appendChild(listItem);
  }
  
  displayArea.innerHTML = '';
  displayArea.appendChild(bookList);
}

async function main() {
  const books = await fetchBooksData();
  console.log(books);
  displayBooks(books);
}

main();
