from fastapi import FastAPI, File, UploadFile, Form, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models  
import random
from typing import Optional
import os
import shutil

from passlib.context import CryptContext
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace "*" with your frontend origin (e.g., "http://localhost:3000")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

models.Base.metadata.create_all(bind=engine)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class UserBase(BaseModel):
    username: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

# Hashing the password
def get_password_hash(password):
    return pwd_context.hash(password)

# Verifying password
def verify_password(plain_password, hashed_password):
    result = pwd_context.verify(plain_password, hashed_password)
    print(f"Verifying password: {plain_password} -> {result}")  # Debugging info
    return result


# Create user endpoint (Register)
@app.post("/users/", status_code=status.HTTP_201_CREATED)
async def create_user(user: UserBase, db: Session = Depends(get_db)):
    db_user = models.User(username=user.username, password=get_password_hash(user.password))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/login/", status_code=status.HTTP_200_OK)
async def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    
    if not db_user:
        print(f"User {user.username} not found.")
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    print(f"Found user: {db_user.username}")
    
    if not verify_password(user.password, db_user.password):
        print(f"Password mismatch for user {user.username}")
        raise HTTPException(status_code=400, detail="Invalid username or password")
    
    return {"message": "Login successful"}

# FAQ
class FAQBase(BaseModel):
    fruit_name: str
    question: str
    answer: str
    image: str = None  

class FAQCreate(FAQBase):
    pass

class FAQ(FAQBase):
    id: int

    class Config:
        orm_mode = True
@app.get("/faqs", response_model=list[FAQ])
def get_faqs(db: Session = Depends(get_db)):
    return db.query(models.FAQ).all()

@app.post("/faqs", response_model=FAQ, status_code=status.HTTP_201_CREATED)
def create_faq(faq: FAQCreate, db: Session = Depends(get_db)):
    db_faq = models.FAQ(**faq.dict())
    db.add(db_faq)
    db.commit()
    db.refresh(db_faq)
    return db_faq
    

@app.delete("/faqs/{faq_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_faq(faq_id: int, db: Session = Depends(get_db)):
    faq = db.query(models.FAQ).filter(models.FAQ.id == faq_id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    db.delete(faq)
    db.commit()
    return None

@app.put("/faqs/{faq_id}", response_model=FAQ)
def update_faq(faq_id: int, faq: FAQBase, db: Session = Depends(get_db)):
    existing_faq = db.query(models.FAQ).filter(models.FAQ.id == faq_id).first()
    if not existing_faq:
        raise HTTPException(status_code=404, detail="FAQ not found")
    for key, value in faq.dict().items():
        setattr(existing_faq, key, value)
    db.commit()
    db.refresh(existing_faq)
    return existing_faq



#chatbot 
# Function to seed the fruits table
def seed_fruits(db: Session):
    fruits = [
        {"name": "Apple", "description": "A sweet red fruit", "price": 1.0,"image_url":"https://www.truebasics.com/blog/wp-content/uploads/2023/09/apple-benefits.jpg"},
        {"name": "Banana", "description": "A yellow fruit", "price": 0.5,"image_url":"https://images.unsplash.com/photo-1543218024-57a70143c369?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fEJhbmFuYXxlbnwwfHwwfHx8MA%3D%3D"},
        {"name": "Orange", "description": "A citrus fruit", "price": 0.8,"image_url":"https://plus.unsplash.com/premium_photo-1669631942245-b59133973523?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8b3Jhbmdlc3xlbnwwfHwwfHx8MA%3D%3D"},
        {"name": "Mango", "description": "A tropical fruit", "price": 1.2,"image_url":"https://plus.unsplash.com/premium_photo-1674382739389-338645e7dd8c?q=80&w=1227&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Grapes", "description": "Small round fruit", "price": 2.0,"image_url":"https://plus.unsplash.com/premium_photo-1692809723059-a70874355d1a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z3JhcGVzfGVufDB8fDB8fHww"},
        {"name": "Pineapple", "description": "A tropical fruit with spiky skin", "price": 3.0,"image_url":"https://plus.unsplash.com/premium_photo-1661411402574-3601d0cd096f?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"},
        {"name": "Strawberry", "description": "A red berry", "price": 2.5,"image_url":"https://images.unsplash.com/photo-1623227866842-a7d984204a50?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U3Rhd2JlcnJ5fGVufDB8fDB8fHww"},
        {"name": "Blueberry", "description": "Small blue fruit", "price": 3.5,"image_url":"https://images.unsplash.com/photo-1717294537554-e4e6c17e215a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGJsdWJlcnJ5fGVufDB8fDB8fHww"},
        {"name": "Peach", "description": "A soft, juicy fruit", "price": 1.5,"image_url":"https://images.unsplash.com/photo-1532704868953-d85f24176d73?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGVhY2hlc3xlbnwwfHwwfHx8MA%3D%3D"},
        {"name": "Watermelon", "description": "A large, hydrating fruit", "price": 4.0,"url_image":"https://media.istockphoto.com/id/1218952728/photo/watermelon-bowl.jpg?s=1024x1024&w=is&k=20&c=-MANgIYQiesLuNpYSqe0qn09dlgBBke5q-yHc-shqFs="}
    ]

    for fruit in fruits:
        if not db.query(models.Fruits).filter(models.Fruits.name == fruit["name"]).first():
            db.add(models.Fruits(**fruit))
    db.commit()


# Add this endpoint to your FastAPI application
@app.get("/api/fruits")
async def get_fruits(name: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Fruits)
    if name:
        query = query.filter(models.Fruits.name.ilike(f"%{name}%"))
    fruits = query.all()
    return fruits  # Ensure image_url is being returned here



#chat
def get_password_hash(password):
    return pwd_context.hash(password)

# Verify password
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# Pydantic models
class UserLoginForChatbot(BaseModel):
    phone: str  # Use 'phone' instead of 'username'
    password: str



class CheckUserPhone(BaseModel):
    phone: str

@app.post("/chatlogin/", status_code=status.HTTP_200_OK)
async def chat_login(user: UserLoginForChatbot, db: Session = Depends(get_db)):
    # Query the Chatbot table instead of User
    db_user = db.query(models.Chatbot).filter(models.Chatbot.mobile == user.phone).first()
    
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid phone number or password")
    
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid phone number or password")
    
    return {"message": "Login successful"}






@app.post("/api/check-user")
async def check_user(phone: CheckUserPhone, db: Session = Depends(get_db)):
   
    user = db.query(models.Chatbot).filter(models.Chatbot.mobile == phone.phone).first()
    if user:
        return {"exists": True}  # User exists, proceed to login (password prompt)
    return {"exists": False}  # User does not exist, proceed to account setup


UPLOAD_DIRECTORY = "./uploaded_images/"

@app.post("/api/setup-account")
async def setup_account(
    phone: str = Form(...),
    first_name: str = Form(...),
    last_name: str = Form(...),
    password: str = Form(...),
    profile_image: UploadFile = File(None),  # Optional image file
    db: Session = Depends(get_db)
):
    # Check if the user already exists
    if db.query(models.Chatbot).filter(models.Chatbot.mobile == phone).first():
        raise HTTPException(status_code=400, detail="User with this phone number already exists")

    # Handle profile image upload
    image_path = None
    if profile_image:
        image_filename = f"{phone}_{profile_image.filename}"
        image_path = os.path.join(UPLOAD_DIRECTORY, image_filename)
        
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(profile_image.file, buffer)
    
    # Create a new user
    new_user = models.Chatbot(
        mobile=phone,
        first_name=first_name,
        last_name=last_name,
        password=get_password_hash(password),
        profile_image=image_path  # Save the image path in the database
    )
    
    db.add(new_user)
    db.commit()
    
    return {"message": "Account created successfully", "image_url": image_path}