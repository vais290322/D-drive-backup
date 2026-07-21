// const libraryApi = "http://192.168.0.156:8080/api/v1/library";
// const libraryApi = "http://147.93.116.69:8080/api/v1/library";
// const libraryApi = "https://collage.vaisacademy.com/service8/api/v1/library";


const baseUrl = import.meta.env.VITE_REACT_SERVICE8_URL

const libraryApi = `${baseUrl}/api/v1/library`;

const libraryUrlApi = {
    // add book category page 
    addBookCategory: { 
    url: `${libraryApi}/categories`,
    method: "POST",
    },

    // add book page 
    getAllBook:{ 
        url: `${libraryApi}/books`,
    },
    
    // issue book page
    issueBook:{
        url: `${libraryApi}/book-issues`,
        method: "POST",
    },

    // return book page
    returnBook:{
        url: `${libraryApi}/return-books`,
        method: "POST",
    },

    // view issued book page
    viewIssuedBook:{
        url: `${libraryApi}/book-issues`,
    },
    // view issued book page
    pendingBook:{
        url: `${libraryApi}/book-issues/pending-count`,
    },
    librarianSummary:{
        url: `${libraryApi}/fetch-librarian-summary`,
    },
}

export default libraryUrlApi;