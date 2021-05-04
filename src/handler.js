const { nanoid } = require("nanoid");
const books = require("./books");

const addBookHandler = (request, h) => {
  const id = nanoid();
  if (request.payload) {
    const {
      name = "",
      year = 0,
      author = "",
      summary = "",
      publisher = "",
      pageCount = 0,
      readPage = 0,
      reading = false,
    } = request.payload;

    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };
    if (!name) {
      const response = h.response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      });
      response.code(400);
      return response;
    }
    if (readPage > pageCount) {
      const response = h.response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      });
      response.code(400);
      return response;
    }
    books.push(newBook);
    const response = h.response({
      status: "success",
      message: "Buku berhasil ditambahkan",
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }
  const response = h.response({
    status: "error",
    message: "Buku gagal ditambahkan",
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name = "", reading, finished } = request.query;
  let booksToShow = [...books];

  if (name) {
    booksToShow = booksToShow.filter((book) =>
      book.name.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (reading == 0) {
    booksToShow = booksToShow.filter((book) => book.reading);
  } else if (reading == 1) {
    booksToShow = booksToShow.filter((book) => !book.reading);
  }

  if (finished == 0) {
    booksToShow = booksToShow.filter((book) => !book.finished);
  } else if (finished == 1) {
    booksToShow = booksToShow.filter((book) => book.finished);
  }
  booksToShow = booksToShow.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));
  const response = h.response({
    status: "success",
    data: {
      books: booksToShow,
    },
  });
  response.code(200);
  return response;
};

const getBookById = (request, h) => {
  const { id } = request.params;
  const book = books.find((book) => book.id === id);

  if (!book) {
    const response = h.response({
      status: "fail",
      message: "Buku tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: "success",
    data: {
      book,
    },
  });
  response.code(200);
  return response;
};

const updateBookById = (request, h) => {
  if (request.payload) {
    const { id } = request.params;
    const {
      name = "",
      year = 0,
      author = "",
      summary = "",
      publisher = "",
      pageCount = 0,
      readPage = 0,
      reading = false,
    } = request.payload;

    const updatedAt = new Date().toISOString();
    const book = books.find((book) => book.id === id);
    const index = books.findIndex((book) => book.id === id);
    if (book) {
      const updatedBook = {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
      };
      if (!name) {
        const response = h.response({
          status: "fail",
          message: "Gagal memperbarui buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;
      }
      if (readPage > pageCount) {
        const response = h.response({
          status: "fail",
          message:
            "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
      }

      books[index] = { ...book, ...updatedBook };
      const response = h.response({
        status: "success",
        message: "Buku berhasil diperbarui",
        data: {
          bookId: id,
        },
      });
      response.code(200);
      return response;
    }
    const response = h.response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  const response = h.response({
    status: "error",
    message: "Buku gagal dipebarui",
  });
  response.code(500);
  return response;
};

// const deleteBookById = (request, h) => {
//   const { id } = request.params;

//   const index = books.findIndex((book) => book.id === id);
//   const book = books.find((book) => book.id === id);
//   console.log(book);
//   if (index !== -1) {
//     books.splice(index, 1);
//     const response = h.response({
//       status: 'success',
//       message: 'Buku berhasil dihapus',
//     });
//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: 'fail',
//     message: 'Buku gagal dihapus. Id tidak ditemukan',
//     });
//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: "fail",

//       message: "Buku berhasil dihapus",
//     }

//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: "fail",
//     message: `Buku gagal dihapus. Id tidak ditemukan`,
//       message: "Buku berhasil dihapus",
//     });
//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: "fail",
//     message: `Buku gagal dihapus. Id tidak ditemukan`,
// ss",
//       message: "Buku berhasil dihapus",
//     });
//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: "fail",
//     message: `Buku gagal dihapus. Id tidak ditemukan`,
// ss",
//       message: "Buku berhasil dihapus",
//     });
//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: "fail",
//     message: `Buku gagal dihapus. Id tidak ditemukan`,
// ss",
//       message: "Buku berhasil dihapus",
//     });
//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: "fail",
//     message: `Buku gagal dihapus. Id tidak ditemukan`,
// ss",
//       message: "Buku berhasil dihapus",
//     });
//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: "fail",
//     message: `Buku gagal dihapus. Id tidak ditemukan`,
// ss",
//       message: "Buku berhasil dihapus",
//     });
//     response.code(200);
//     return response;
//   }
//   const response = h.response({
//     status: "fail",
//     message: `Buku gagal dihapus. Id tidak ditemukan`,
//   });
//   response.code(404);
//   return response;
// };

const deleteBookById = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Buku berhasil dihapus",
    });
    response.code(200);
    return response;
  }
  const response = h.response({
    status: "fail",
    message: "Buku gagal dihapus. Id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookById,
  updateBookById,
  deleteBookById,
};
