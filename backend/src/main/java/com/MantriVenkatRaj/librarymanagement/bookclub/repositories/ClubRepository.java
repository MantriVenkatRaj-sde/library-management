package com.MantriVenkatRaj.librarymanagement.bookclub.repositories;

import com.MantriVenkatRaj.librarymanagement.bookclub.entities.BookClub;
import com.MantriVenkatRaj.librarymanagement.bookclub.enums.Visibility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<BookClub,Long> {
    Optional<BookClub> findByName(String name);

    Optional<List<BookClub>> findByVisibility(Visibility visibility);

    Optional<List<BookClub>> findByAdmin_Username(String username);

    // Club name search
    List<BookClub> findByNameContainingIgnoreCase(String name);
    // Search by description (for keywords like 'fantasy', 'romance')
    List<BookClub> findByDescriptionContainingIgnoreCase(String keyword);

    // Combined search: name OR description
    @Query("SELECT c FROM BookClub c " +
            "WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "   OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<BookClub> searchByKeyword(@Param("keyword") String keyword);

        @Query("""
          select c from BookClub c
          left join fetch c.members
          left join fetch c.messages
          where c.name = :name
        """)
        Optional<BookClub> findByNameWithMembersAndMessages(String name);
}