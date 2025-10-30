from sqlalchemy import Column, Integer, String, Date, Text, Index
from .database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    priority = Column(String, default="Medium", index=True)
    status = Column(String, default="Pending")
    due_date = Column(Date, nullable=True)
    owner_id = Column(Integer, nullable=False, index=True) 

    __table_args__ = (
        Index('ix_task_status', 'status'),
        Index('ix_task_due_date', 'due_date'),
        Index('ix_task_owner_id', 'owner_id'),
    )