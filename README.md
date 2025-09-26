# MathCanvas

This project is designed to analyze mathematical expressions from images and interpret drawings using AI-powered tools. By leveraging Google’s Generative AI (Gemini) and other tools, the application provides capabilities for solving mathematical problems and generating insightful descriptions of drawings. The project also includes functionality to create AI-generated images based on specified attributes, context, and style notes.

---

## Features

### 1. **Mathematical Expression Analysis**
- Detect and solve mathematical expressions from input images.
- Handle variable assignments, systems of equations, and abstract mathematical problems.
- Support PEMDAS rule for accurate computations.

### 2. **Drawing Interpretation**
- Identify primary objects and themes in drawings.
- Provide detailed attributes, contextual descriptions, and stylistic notes.
- Deliver results in a structured, easy-to-parse format.

### 3. **AI-Generated Images**
- Generate high-quality images based on user-defined attributes, primary objects, context, and style.
- Utilize advanced prompts for enhanced realism, detail, and resolution.

---

## Technologies Used

- **Python**: Core programming language for implementation.
- **Google Generative AI (Gemini)**: AI-powered model for analyzing and interpreting inputs.
- **Pillow**: Library for handling image processing tasks.
- **dotenv**: Environment variable management.
- **Requests**: HTTP requests for external API calls.

---

## Installation and Setup

### Prerequisites
1. Python 3.7 or later
2. A valid Google Generative AI (Gemini) API key

### Steps
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>
   ```
2. Create a `.env` file in the project root and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

---

## Usage

### 1. **Analyze Mathematical Expressions**
```python
from PIL import Image

dict_of_vars = {"x": 5, "y": 10}
img = Image.open("path_to_math_image.jpg")
result = analyze_image(img, dict_of_vars)
print(result)
```

### 2. **Understand Drawings**
```python
from PIL import Image

dict_of_vars = {}
img = Image.open("path_to_drawing.jpg")
result = understand_image(img, dict_of_vars)
print(result)
```

### 3. **Generate AI-Driven Images**
```python
image = generate_image(
    attributes="tall and ancient",
    primary_object="tree",
    context="in a foggy forest",
    style_notes="sketched with charcoal on canvas"
)
if image:
    image.show()
    image.save("output_image.jpg")
```

---

## Project Structure
```
.
├── analyze_image.py        # Module for analyzing math expressions from images
├── understand_image.py     # Module for interpreting drawings
├── generate_image.py       # Module for generating AI-driven images
├── requirements.txt        # List of project dependencies
├── .env                    # Environment variables
├── README.md               # Project documentation
└── images/                 # Folder for storing input/output images
```

---

## API Documentation

### `analyze_image(img: Image, dict_of_vars: dict)`
- **Input**:
  - `img`: An image object containing a mathematical expression.
  - `dict_of_vars`: Dictionary of variable assignments.
- **Output**: A list of dictionaries with results.

### `understand_image(img: Image, dict_of_vars: dict)`
- **Input**:
  - `img`: An image object of a drawing.
  - `dict_of_vars`: Optional dictionary for variable interpretation.
- **Output**: A list of dictionaries describing the drawing.

### `generate_image(attributes: str, primary_object: str, context: str, style_notes: str)`
- **Input**: Attributes, primary object, context, and style notes.
- **Output**: A generated high-quality image.

---

## Example Scenarios

### 1. **Mathematical Problem-Solving**
Upload an image containing equations or expressions, and the tool will return step-by-step solutions.

### 2. **Drawing Analysis**
Provide a sketch or illustration, and the tool will describe the objects, context, and artistic style.

### 3. **Creative Image Generation**
Define attributes and context for generating photorealistic or stylistic images.

---

## Acknowledgments
- Google Generative AI (Gemini)
- OpenAI
- Python Community

