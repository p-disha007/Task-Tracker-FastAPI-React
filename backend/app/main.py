from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from . import crud, models, schemas
from .database import SessionLocal, engine
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Mini Task Tracker")
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
@app.post("/tasks", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    """
    Add a new task.
    """
    return crud.create_task(db=db, task=task)


@app.get("/tasks", response_model=List[schemas.Task])
def read_tasks(
    status: Optional[str] = Query(None, enum=["Pending", "In Progress", "Done"]),
    priority: Optional[str] = Query(None, enum=["Low", "Medium", "High"]),
    sort_by: Optional[str] = Query("due_date", enum=["due_date", "priority"]),
    db: Session = Depends(get_db)
):
    """
    List all tasks.
    Supports filtering by status or priority, and sorting.
    """
    tasks = crud.get_tasks(db, status=status, priority=priority, sort_by=sort_by)
    return tasks


@app.patch("/tasks/{task_id}", response_model=schemas.Task)
def update_task_status(
    task_id: int, 
    task_update: schemas.TaskUpdate, 
    db: Session = Depends(get_db)
):
    """
    Update a task's status or priority.
    """
    db_task = crud.update_task(db=db, task_id=task_id, task_update=task_update)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task


@app.get("/insights", response_model=schemas.InsightSummary)
def get_insights(db: Session = Depends(get_db)):
    """
    Return a computed summary of the current workload.
    """
    return crud.get_task_insights(db=db)