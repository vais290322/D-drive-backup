const libraryApi = "http://192.168.0.141:8080/api/v1/library";
// const libraryApi = "http://147.93.116.69:8080/api/v1/library";
// const libraryApi = "https://vaisacademy.com/service8/api/v1/library";

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
}

export default libraryUrlApi;