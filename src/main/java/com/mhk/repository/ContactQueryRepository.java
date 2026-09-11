package com.mhk.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.mhk.entity.ContactQuery;

public interface ContactQueryRepository extends JpaRepository<ContactQuery, Long> {

}