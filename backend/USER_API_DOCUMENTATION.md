# User API Documentation

## Base URL

```
http://localhost:8080/users
```

## Endpoints

### 1. Create User

**POST** `/users`

**Request Body:**

```json
{
  "username": "john_doe",
  "password": "password123",
  "fullname": "John Doe",
  "status": 1,
  "avatar": "https://example.com/avatar.jpg",
  "roleId": 1
}
```

**Validation Rules:**

- `username`: Required, 3-50 characters
- `password`: Required, min 6 characters
- `fullname`: Required, max 100 characters
- `status`: Required, min 0
- `roleId`: Required

**Success Response (201 CREATED):**

```json
{
  "code": 1000,
  "message": "User created successfully",
  "result": {
    "id": 1,
    "username": "john_doe",
    "fullname": "John Doe",
    "status": 1,
    "avatar": "https://example.com/avatar.jpg",
    "roleId": 1,
    "roleName": "Admin"
  }
}
```

**Error Responses:**

- `1001`: Username already exists
- `1002`: Username invalid (not between 3-50 characters)
- `1003`: Password invalid (less than 6 characters)
- `1007`: Role does not exist

---

### 2. Update User

**PUT** `/users/{id}`

**Request Body:**

```json
{
  "fullname": "John Doe Updated",
  "status": 1,
  "avatar": "https://example.com/new-avatar.jpg",
  "roleId": 2,
  "password": "newpassword123"
}
```

**Notes:**

- All fields are **optional**
- If `password` is not provided or empty, the current password will be kept
- If `roleId` is not provided, the current role will be kept

**Validation Rules:**

- `fullname`: Max 100 characters
- `status`: Min 0
- `avatar`: Max 255 characters
- `password`: If provided, min 6 characters

**Success Response (200 OK):**

```json
{
  "code": 1000,
  "message": "User updated successfully",
  "result": {
    "id": 1,
    "username": "john_doe",
    "fullname": "John Doe Updated",
    "status": 1,
    "avatar": "https://example.com/new-avatar.jpg",
    "roleId": 2,
    "roleName": "User"
  }
}
```

**Error Responses:**

- `1004`: User does not exist
- `1007`: Role does not exist

---

### 3. Get All Users

**GET** `/users`

**Success Response (200 OK):**

```json
{
  "code": 1000,
  "message": "Get all users successfully",
  "result": [
    {
      "id": 1,
      "username": "john_doe",
      "fullname": "John Doe",
      "status": 1,
      "avatar": "https://example.com/avatar.jpg",
      "roleId": 1,
      "roleName": "Admin"
    },
    {
      "id": 2,
      "username": "jane_smith",
      "fullname": "Jane Smith",
      "status": 1,
      "avatar": null,
      "roleId": 2,
      "roleName": "User"
    }
  ]
}
```

---

### 4. Get User By ID

**GET** `/users/{id}`

**Success Response (200 OK):**

```json
{
  "code": 1000,
  "message": "Get user successfully",
  "result": {
    "id": 1,
    "username": "john_doe",
    "fullname": "John Doe",
    "status": 1,
    "avatar": "https://example.com/avatar.jpg",
    "roleId": 1,
    "roleName": "Admin"
  }
}
```

**Error Response:**

- `1004`: User does not exist

---

### 5. Delete User

**DELETE** `/users/{id}`

**Success Response (200 OK):**

```json
{
  "code": 1000,
  "message": "User deleted successfully"
}
```

**Error Response:**

- `1004`: User does not exist

---

## Testing with cURL

### Create User

```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "fullname": "John Doe",
    "status": 1,
    "roleId": 1
  }'
```

### Update User

```bash
curl -X PUT http://localhost:8080/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullname": "John Doe Updated",
    "status": 1
  }'
```

### Get All Users

```bash
curl -X GET http://localhost:8080/users
```

### Get User By ID

```bash
curl -X GET http://localhost:8080/users/1
```

### Delete User

```bash
curl -X DELETE http://localhost:8080/users/1
```

---

## Error Codes Reference

| Code | Message                                           | HTTP Status |
| ---- | ------------------------------------------------- | ----------- |
| 1000 | Success (default)                                 | 200         |
| 1001 | User already exists                               | 400         |
| 1002 | Username must be between 3 and 50 characters long | 400         |
| 1003 | Password must be at least {min} characters long   | 400         |
| 1004 | User does not exist                               | 404         |
| 1007 | Role does not exist                               | 404         |
| 1008 | Invalid key                                       | 400         |
| 9999 | Uncategorized error                               | 500         |

---

## Important Notes

### Update User Behavior

1. **Password Update**: The password is only updated if:

   - The `password` field is provided in the request
   - The `password` value is not null
   - The `password` value is not empty or whitespace

2. **Role Update**: The role is only updated if:

   - The `roleId` field is provided in the request
   - The `roleId` is not null
   - The role with that ID exists in the database

3. **Other Fields**: All other fields (fullname, status, avatar) will be updated if provided, or remain unchanged if not provided.

### Example: Update Only Password

```json
{
  "password": "newpassword123"
}
```

This will only update the password and keep all other fields unchanged.

### Example: Update Without Password

```json
{
  "fullname": "New Name",
  "status": 0
}
```

This will update fullname and status, but keep the existing password.
