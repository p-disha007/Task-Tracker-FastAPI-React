1. Technology Choices

* **Backend (FastAPI):** Chosen over Flask for its modern async capabilities, automatic data validation via Pydantic, and built-in interactive API documentation (`/docs`), which is perfect for development and testing.
* **Database (SQLite + SQLAlchemy):** SQLite was used for its simplicity (no server setup required), making the project easy to run. SQLAlchemy is used as the ORM to provide a clean, database-agnostic way to define models and query data, demonstrating good backend practices.
* **Frontend (React + Vite):** React was chosen for its component-based architecture and efficient state management, which maps well to the requirements. Vite provides an extremely fast development server and build process.
* **CORS:** `fastapi.middleware.cors` is included to allow the frontend (running on a different port) to communicate with the backend API without browser security issues.

2. Database Schema

* **Model:** A single `Task` table is used.
* **Fields:**
    * `id`: Standard integer primary key.
    * `title`: `String`, non-nullable.
    * `description`: `Text`, nullable.
    * `priority`: `String`. I enforced constraints (`'Low'`, `'Medium'`, `'High'`) at the Pydantic schema level (in `schemas.py`) rather than the DB level for simplicity, but a production app would use a DB-level `Enum` or a foreign key to a `priorities` table.
    * `status`: `String`. Similar to priority, validated at the schema level (`'Pending'`, `'In Progress'`, `'Done'`).
    * `due_date`: `Date`. Using a `Date` type (not `DateTime`) is sufficient for this app.
* **Indexing:** An index (`index=True`) is placed on `due_date` and `status`. This significantly speeds up the most common queries: sorting by due date and filtering by status.

3. API & "Smart Insight" Logic

* **API Design:** The API follows standard REST principles. `GET /tasks` uses query parameters for filtering, which is more efficient than fetching all data and filtering on the client. `PATCH` is used for partial updates (changing status), which is semantically correct.
* **Insights Endpoint (`/insights`):** The logic is implemented entirely in Python on the backend.
    1.  It fetches all *non-completed* tasks from the database in one query.
    2.  It uses Python's `datetime` and `collections.Counter` to efficiently process this list.
    3.  It calculates:
        * Total open tasks.
        * Tasks due "soon" (within the next 3 days).
        * The most common (dominant) priority.
    4.  A series of `if-elif-else` statements build a human-readable string. This logic is simple, fast, and requires no external "AI" service, meeting the spirit of the requirement.

4. Future Improvements

If I had more time, I would:

1.  **Add User Authentication (JWT):** Implement the bonus challenge. This would require adding a `User` model, `user_id` foreign key on the `Task` model, and login/register endpoints.
2.  **Backend Pagination:** The `crud.py` file is ready for `skip` and `limit`, but I'd fully implement this on the `GET /tasks` endpoint and add pagination controls to the frontend to handle thousands of tasks.
3.  **Robust Error Handling:** Add more specific loading and error states to the React frontend (e.g., "Loading tasks...", "Failed to add task").
4.  **Database Migrations:** Use `Alembic` to manage database schema changes, which is essential for a production environment.