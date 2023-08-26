# Use an official Python runtime as the base image
FROM python:3.9

# Set the working directory inside the container
WORKDIR /app

# Copy requirements.txt to the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application files to the container
COPY . .

# Expose the port the application will run on (if applicable)
EXPOSE 8000

# Command to start the application
CMD ["python", "main.py"]
