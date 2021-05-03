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

    const finished = pageCount === readPage ? true : false;
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
    } else if (readPage > pageCount) {
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
  } else {
    const response = h.response({
      status: "error",
      message: "Buku gagal ditambahkan",
    });
    response.code(500);
    return response;
  }
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  let filteredBook = [];
  if (name) {
    filteredBook = [
      ...filteredBook,
      ...books.filter((book) => book.name.includes(name)),
    ];
  }

  if (reading == 0) {
    filteredBook = [...filteredBook, ...books.filter((book) => !book.reading)];
  } else if (reading == 1) {
    filteredBook = [...filteredBook, ...books.filter((book) => book.reading)];
  }

  if (finished == 0) {
    filteredBook = [...filteredBook, ...books.filter((book) => !book.finished)];
  } else if (finished == 1) {
    filteredBook = [...filteredBook, ...books.filter((book) => book.finished)];
  }
  const response = h.response({
    status: "success",
    data: {
      books: filteredBook,
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
      } else if (readPage > pageCount) {
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
    } else {
      const response = h.response({
        status: "success",
        message: "Gagal memperbaharui buku. " + id + " tidak ditemukan",
      });
      response.code(404);
      return response;
    }
  } else {
    const response = h.response({
      status: "error",
      message: "Buku gagal dipebarui",
    });
    response.code(500);
    return response;
  }
};

const deleteBookById = (request, h) => {
  const { id } = request.params;

  const index = books.findIndex((book) => book.id === id);
  if (index === -1) {
    const response = h.response({
      status: "fail",
      message: "Buku gagal dihapus " + id + " tidak ditemukan",
    });
    response.code(404);
    return response;
  }
  books.splice(index, 1);
  const response = h.response({
    status: "success",
    message: "Buku berhasil dihapus",
  });
  response.code(200);
  return response;
};
module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookById,
  updateBookById,
  deleteBookById,
};
