from sqlalchemy.orm import Session

from . import models, schemas

from datetime import date, timedelta

from collections import Counter

from sqlalchemy import func

from typing import Optional



def get_task(db: Session, task_id: int):

    return db.query(models.Task).filter(models.Task.id == task_id).first()



def get_tasks(db: Session, status: Optional[str] = None, priority: Optional[str] = None, sort_by: str = "due_date", skip: int = 0, limit: int = 100):

    query = db.query(models.Task)



    if status:

        query = query.filter(models.Task.status == status)

    if priority:

        query = query.filter(models.Task.priority == priority)

    if sort_by == "due_date":

        query = query.order_by(models.Task.due_date.asc())

    elif sort_by == "priority":

        query = query.order_by(

            func.decode(

                models.Task.priority,

                'High', 1,

                'Medium', 2,

                'Low', 3,

                4

            )

        )

   

    return query.offset(skip).limit(limit).all()



def create_task(db: Session, task: schemas.TaskCreate):

    db_task = models.Task(**task.dict())

    db.add(db_task)

    db.commit()

    db.refresh(db_task)

    return db_task



def update_task(db: Session, task_id: int, task_update: schemas.TaskUpdate):

    db_task = get_task(db, task_id)

    if not db_task:

        return None

    update_data = task_update.dict(exclude_unset=True)

    for key, value in update_data.items():

        setattr(db_task, key, value)

       

    db.commit()

    db.refresh(db_task)

    return db_task



def get_task_insights(db: Session):

    open_tasks = db.query(models.Task).filter(models.Task.status != "Done").all()

   

    total_open_tasks = len(open_tasks)

    if total_open_tasks == 0:

        return schemas.InsightSummary(

            total_open_tasks=0,

            due_soon_count=0,

            dominant_priority=None,

            busiest_day=None,

            summary_message="You're all caught up! No open tasks."

        )



    today = date.today()

    due_soon_date = today + timedelta(days=3)

    due_soon_count = sum(1 for task in open_tasks if task.due_date and task.due_date <= due_soon_date)

    priority_counts = Counter(task.priority for task in open_tasks)

    dominant_priority = priority_counts.most_common(1)[0][0] if priority_counts else None

    due_date_counts = Counter(task.due_date for task in open_tasks if task.due_date)

    busiest_day = due_date_counts.most_common(1)[0][0] if due_date_counts else None

    summary_message = f"You have {total_open_tasks} open tasks. "

   

    if dominant_priority:

        summary_message += f"Most are '{dominant_priority}' priority. "

       

    if due_soon_count > 0:

        summary_message += f"Heads up! {due_soon_count} {'task is' if due_soon_count == 1 else 'tasks are'} due in the next 3 days."

    else:

        summary_message += "Nothing is due urgently."



    return schemas.InsightSummary(

        total_open_tasks=total_open_tasks,

        due_soon_count=due_soon_count,

        dominant_priority=dominant_priority,

        busiest_day=busiest_day,

        summary_message=summary_message

    )