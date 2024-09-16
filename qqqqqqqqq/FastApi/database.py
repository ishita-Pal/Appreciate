import pymysql
pymysql.install_as_MySQLdb()  # Use PyMySQL instead of MySQLdb

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Database URL
DATABASE_URL = "mysql://avnadmin:AVNS_d4nhudYtpjbNGhWJYAQ@mysql-8e18851-ishitapal1828-ffa7.c.aivencloud.com:11246/test4"

# Create engine using DATABASE_URL
engine = create_engine(DATABASE_URL)

# SessionLocal will be used to interact with the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for all models
Base = declarative_base()
