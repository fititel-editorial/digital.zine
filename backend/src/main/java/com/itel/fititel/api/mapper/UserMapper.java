package com.itel.fititel.api.mapper;

import com.itel.fititel.api.dto.UserResponse;
import com.itel.fititel.domain.entity.User;

import java.util.List;

/**
 * Manual mapper: entity -> response DTO. Never copies the password hash.
 */
public final class UserMapper {

    private UserMapper() {
    }

    public static UserResponse toResponse(User user, List<Long> editorOf) {
        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name(),
                editorOf,
                user.getCreatedAt()
        );
    }
}
