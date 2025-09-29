package com.MantriVenkatRaj.librarymanagement.bookclub.repositories;

import com.MantriVenkatRaj.librarymanagement.bookclub.entities.ClubMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMemberRepository extends JpaRepository<ClubMember,Long> {
    Optional<List<ClubMember>> findByClub_Name(String clubName);
    Optional<List<ClubMember>> findByUser_Username(String username);
    List<ClubMember> findByUser_Id(Long userId);
    Long countByClub_Id(Long clubId);
    void deleteByUser_UsernameAndClub_Name(String username, String clubname);


    Optional<ClubMember> findByUser_IdAndClub_Id(Long userId, Long clubId);
    Optional<ClubMember> findByUser_UsernameAndClub_Name(String username, String clubname);
    @Query("""
        select cm from ClubMember cm
        join fetch cm.club c
        where cm.user.username = :username
        order by coalesce(c.lastMessageAt, c.createdAt) desc
        """)
    List<ClubMember> findByUser_UsernameOrderByLastActivity(@Param("username") String username);


}


