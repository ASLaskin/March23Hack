import pandas as pd
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Ensure you've downloaded the necessary NLTK data
nltk.download('punkt')
nltk.download('stopwords')

# Load and preprocess dataset
df = pd.read_csv('questions_dataset.csv')
stop_words = set(stopwords.words('english'))


# Preprocess the text
def preprocess_text(text):
    words = word_tokenize(text)
    stripped_words = [word for word in words if word.lower() not in stop_words]
    return " ".join(stripped_words)


# Preprocess all questions
preprocessed_questions = [preprocess_text(question) for question in df['Question'].tolist()]

# Initialize and fit CountVectorizer
vectorizer = CountVectorizer()
questions_vectors = vectorizer.fit_transform(preprocessed_questions)


def generate_answer(user_question):
    # Preprocess the user question
    preprocessed_user_question = preprocess_text(user_question)

    # Transform the preprocessed phrase using the same vectorizer used for training data
    user_question_vector = vectorizer.transform([preprocessed_user_question])

    # Compute cosine similarities
    similarities = cosine_similarity(questions_vectors, user_question_vector)

    # Find the index of the most similar question
    most_similar_index = similarities.argmax()

    # Get the associated answer
    most_similar_answer = df.iloc[most_similar_index]['Answer']

    return most_similar_answer


# Example usage
user_question = ""
answer = generate_answer(user_question)
print(answer)
