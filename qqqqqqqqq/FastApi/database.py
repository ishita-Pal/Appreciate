# Install python-dotenv if you haven't
# pip install python-dotenv

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from a .env file

URL_DATABASE = os.getenv('DATABASE_URL', 'mysql+pymysql://root:Loveislove12!@localhost:3306/test4')

engine = create_engine(URL_DATABASE)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
