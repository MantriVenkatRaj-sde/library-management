package com.MantriVenkatRaj.librarymanagement.userbook;

import com.MantriVenkatRaj.librarymanagement.book.Book;
import com.MantriVenkatRaj.librarymanagement.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserBookRepository extends JpaRepository<UserBook,Long> {
    // 1. Find all UserBook records for a given User
    List<UserBook> findByUser(User user);

    // 2. Find all UserBook records for a given Book
    List<UserBook> findByBook(Book book);

    // 3. Find all UserBook records for a given username (traverses User entity)
    List<UserBook> findByUser_Username(String username);

    // 4. Find all UserBook records for a given book title (traverses Book entity)
    List<UserBook> findByBook_Title(String title);

    UserBook findByUser_UsernameAndBook_Isbn(String username, String isbn);

    @Modifying
    @Query("UPDATE UserBook ub SET ub.status = :readStatus WHERE ub.id = :id")
    int updateStatusById(@Param("id") Long id, @Param("readStatus") String readStatus);

    @Modifying(clearAutomatically = true)
    @Query("UPDATE UserBook ub SET ub.status = :status WHERE ub.user.username = :username AND ub.book.isbn = :isbn")
    void updateStatusByUserIdAndBookIsbn(
            @Param("username") String username,
            @Param("isbn") String isbn,
            @Param("status") String status    // or use your enum type, e.g. ReadStatus
    );

    //To delete a record by Username and Isbn number
    void deleteByUser_UsernameAndBook_Isbn(String username, String isbn);
    //To delete records based on their status
    int deleteByUser_UsernameAndBook_IsbnAndStatus(String username, String isbn, UserBook.ReadStatus status);
}
