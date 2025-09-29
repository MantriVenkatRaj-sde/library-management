package com.MantriVenkatRaj.librarymanagement.userbook;

import com.MantriVenkatRaj.librarymanagement.Exception.BookNotFoundException;
import com.MantriVenkatRaj.librarymanagement.Exception.UserNotFoundException;
import com.MantriVenkatRaj.librarymanagement.book.Book;
//import com.MantriVenkatRaj.librarymanagement.book.dtoandmapper.BookDTOMarkedForScrap;
import com.MantriVenkatRaj.librarymanagement.book.BookRepository;
import com.MantriVenkatRaj.librarymanagement.genre.Genre;
import com.MantriVenkatRaj.librarymanagement.user.User;
import com.MantriVenkatRaj.librarymanagement.user.UserDTO;
import com.MantriVenkatRaj.librarymanagement.user.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserBookService {
    private final UserBookRepository userBookRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public UserBookService(UserBookRepository rbrepo, UserRepository urepo, BookRepository brepo) {
        this.userBookRepository = rbrepo;
        this.userRepository = urepo;
        this.bookRepository = brepo;
    }
//    //Get all BooksDTO that are in User's library
//    @Transactional
//    public List<BookDTOMarkedForScrap> getUserBooksListDTO(String username) {
//        List<UserBook> userBookList = userBookRepository.findByUser_Username(username);
//
//        return userBookList.stream()
//                .map(ub -> new BookDTOMarkedForScrap(
//                        ub.getBook().getTitle(),
//                        ub.getBook().getAuthor(),
//                        ub.getBook().getDescription(),
//                        ub.getBook().getIsbn(),
//                        ub.getBook().getGenres().stream()
//                                .map(Genre::getName)   // Convert Genre → String
//                                .collect(Collectors.toSet())
//                ))
//                .collect(Collectors.toList());
//    }
    //Get all Books that are in User's library
    @Transactional
    public List<Book> getUserBooksList(String username) {
        List<UserBook> userBookList = userBookRepository.findByUser_Username(username);
        return userBookList.stream()
                .map(UserBook::getBook)
                .toList();
    }
    //Find all Users from UserBook for a given book title (traverses Book entity)
    @Transactional
    public List<UserDTO> getUsersListReadingTheSameBook(String title){
        List<UserBook> bookUserList= userBookRepository.findByBook_Title(title);
        return bookUserList.stream()
                .map(ub -> new UserDTO(
                        ub.getUser().getId(),
                        ub.getUser().getUsername(),
                        ub.getUser().getAge(),
                        ub.getUser().getEmail(),
                        ub.getUser().getPhone()
                ))
                .collect(Collectors.toList());

    }
    @Transactional
    public void addNewUserBookById(String username,long bookId){
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Book> bookOpt = bookRepository.findById(bookId);
        if(bookOpt.isEmpty()) throw new BookNotFoundException();
        if(userOpt.isEmpty()) throw new UserNotFoundException();

        User user = userOpt.get();
        Book book = bookOpt.get();

        UserBook ub = new UserBook(user, book, UserBook.ReadStatus.Readlist);
        userBookRepository.save(ub);
        user.getReadersList().add(book);
    }

    @Transactional
    public void addNewUserBookByIsbn(String username, String isbn) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        Optional<Book> bookOpt = bookRepository.findByIsbn(isbn);
        if(bookOpt.isEmpty()) throw new BookNotFoundException();
        if(userOpt.isEmpty()) throw new UserNotFoundException();

        User user = userOpt.get();
        Book book = bookOpt.get();

        UserBook ub = new UserBook(user, book, UserBook.ReadStatus.Readlist);
        userBookRepository.save(ub);
        user.getReadersList().add(book);
    }

    @Transactional
    public void updateBookReadingStatus(String username, String isbn, String readStatus) {
        User user=userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
        Book book=bookRepository.findByIsbn(isbn).orElseThrow(BookNotFoundException::new);
        user.getReadersList().remove(book);
        userBookRepository.updateStatusByUserIdAndBookIsbn(username,isbn,readStatus);
        UserBook userBook=userBookRepository.findByUser_UsernameAndBook_Isbn(username,isbn);

        user.getReadersList().add(userBook.getBook());

    }
    @Transactional
    public void abandonAndDelete(String username, String isbn) {
        User user=userRepository.findByUsername(username).orElseThrow(UserNotFoundException::new);
        Book book=bookRepository.findByIsbn(isbn).orElseThrow(BookNotFoundException::new);
        userBookRepository.deleteByUser_UsernameAndBook_Isbn(username,isbn);
        user.getReadersList().remove(book);
    }
}
