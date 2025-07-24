
# 🤖 GSSoC FAQ Bot

An intelligent FAQ bot built using Python and Flask, designed to answer queries related to GirlScript Summer of Code (GSSoC). This bot reads FAQs from a JSON file and returns the most relevant answer using semantic similarity via NLP techniques.

---

## 🔧 Features

- Query understanding with Natural Language Processing (NLP)
- Cosine similarity-based matching
- Preloaded with GSSoC-related FAQs
- Easy-to-extend question-answer pairs
- REST API endpoint for integration

---

## 🧠 How It Works

1. User enters a query.
2. The bot computes the cosine similarity between the query and all known questions.
3. Returns the most semantically similar answer from the dataset.

---

## 🚀 Getting Started

### 📋 Prerequisites

- Python 3.7+
- pip

### 🛠 Installation

Clone the repository:
```bash
git clone https://github.com/abdulwasaeee/gssocFAQ-Bot.git
cd gssocFAQ-Bot


Create a virtual environment (optional but recommended):

```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

Install the dependencies:

```bash
pip install -r requirements.txt
```

---

## 🧪 Run the Bot

Start the Flask server:

```bash
python app.py
```

Navigate to:

```
http://127.0.0.1:5000/
```

---

## 📝 Add More FAQs

Edit the `faq.json` file and add more question-answer pairs in the same format:

```json
{
  "questions": [
    {
      "question": "What is GSSoC?",
      "answer": "GirlScript Summer of Code is a 3-month open-source program conducted by GirlScript Foundation."
    }
  ]
}
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

Steps:

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add something'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🌟 Star the repo

If you found this helpful, consider starring the repository to show your support!

```

Let me know if you want it tailored with badges or deployed links.
```
