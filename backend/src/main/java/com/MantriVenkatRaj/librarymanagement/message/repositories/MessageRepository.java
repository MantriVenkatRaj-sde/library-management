package com.MantriVenkatRaj.librarymanagement.message.repositories;

import com.MantriVenkatRaj.librarymanagement.bookclub.entities.BookClub;
import com.MantriVenkatRaj.librarymanagement.message.entities.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MessageRepository extends JpaRepository<Message,Long> {
    Optional<List<Message>> findBySender_Username(String username);
    Optional<List<Message>> findByClub_Name(String clubName);

    List<Message> findByClub_NameOrderByTimeStampDesc(String groupName);
    List<Message> findTop50ByClub_NameOrderByTimeStampDesc(String groupName);

    List<Message> findByClub_NameAndIdGreaterThanOrderByIdAsc(String clubname, Long afterId);

    Long countByClub_IdAndIdGreaterThan(Long clubId, Long afterId);
    Optional<Message> findTopByClub_NameOrderByIdDesc(String clubname);


    List<Message> findAllByClub_Name(String clubname);
}
