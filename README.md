# AI Email Writer Tool

An AI-powered email writing tool that generates professional emails with minimal user input.

## Features

- Generate emails with just a few inputs (topic, style, etc.)
- Automatically creates subject lines and preview text
- Three email length/style options:
  - Long and entertaining
  - Medium with selling focus
  - Short and direct
- Optional Call-to-Action (CTA) integration
- Copy-to-clipboard functionality

## Technologies Used

- Frontend: HTML, CSS (Bootstrap), JavaScript
- Backend: Node.js, Express
- AI: OpenAI GPT API

## Setup Instructions

1. Clone this repository:
   ```
   git clone <repository-url>
   cd email_writer_tool
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file from the template:
   ```
   cp .env.example .env
   ```

4. Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Start the server:
   ```
   npm start
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Usage

1. Enter a topic or keyword for your email
2. (Optional) Specify a writing style
3. (Optional) Add a Call-to-Action and link
4. Select the desired email length/style
5. Click "Generate Email"
6. Copy the generated email to use in your email marketing platform

## Project Structure

- `index.html`: The main frontend interface
- `script.js`: Frontend JavaScript for handling form submission and displaying results
- `server.js`: Backend server that handles API requests and OpenAI integration
- `package.json`: Node.js project configuration
- `.env`: Environment variables (API keys, etc.)

## License

MIT

## Author

Your Name