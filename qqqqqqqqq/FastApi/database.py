import pymysql
pymysql.install_as_MySQLdb()  
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
DATABASE_URL = "mysql://avnadmin:AVNS_d4nhudYtpjbNGhWJYAQ@mysql-8e18851-ishitapal1828-ffa7.c.aivencloud.com:11246/test4"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
