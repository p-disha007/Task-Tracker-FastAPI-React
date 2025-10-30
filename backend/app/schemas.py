from pydantic import BaseModel, Field

from datetime import date

from typing import Optional, Literal

PriorityType = Literal['Low', 'Medium', 'High']

StatusType = Literal['Pending', 'In Progress', 'Done']



class TaskBase(BaseModel):

    title: str = Field(..., min_length=1, max_length=100)

    description: Optional[str] = Field(None, max_length=500)

    priority: PriorityType = "Medium"

    status: StatusType = "Pending"

    due_date: Optional[date] = None



class TaskCreate(TaskBase):

    pass



class TaskUpdate(BaseModel):

    priority: Optional[PriorityType] = None

    status: Optional[StatusType] = None



class Task(TaskBase):

    id: int



    class Config:

        orm_mode = True

        from_attributes = True



class InsightSummary(BaseModel):

    total_open_tasks: int

    due_soon_count: int

    dominant_priority: Optional[str]

    busiest_day: Optional[date]

    summary_message: str