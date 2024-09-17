from sqlalchemy import Column, Integer, String, Float
from database import Base

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True)
    password = Column(String(128), nullable=False)

class FAQ(Base):
    __tablename__ = 'faq'
    id = Column(Integer, primary_key=True, index=True)
    fruit_name = Column(String(100), nullable=False)
    image = Column(String(255), nullable=True)
    question = Column(String(255), nullable=False)
    answer = Column(String(255), nullable=False)

class Chatbot(Base):
    __tablename__ = 'chatbot'
    mobile = Column(String(15), primary_key=True, index=True)
    password = Column(String(128), nullable=False)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=True)
    profile_image = Column(String(255), nullable=True)

class Fruits(Base):
    __tablename__ = 'fruits'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(255), nullable=True)
    price = Column(Float, nullable=False)
    image = Column(String(255), nullable=True)  
