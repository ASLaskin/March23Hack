import pdfplumber
import json
import torch
from transformers import BertTokenizer, BertForQuestionAnswering


# Function to extract text from PDF using pdfplumber
def extract_text_from_pdf(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        text = ""
        for page in pdf.pages:
            text += page.extract_text()
    return text


# Function to split text into chunks
def split_text(text, max_length, tokenizer):
    words = text.split()
    current_chunk = []
    current_length = 0

    for word in words:
        current_chunk.append(word)
        current_length += len(tokenizer.encode(word, add_special_tokens=False))

        if current_length >= max_length:
            yield ' '.join(current_chunk)
            current_chunk = []
            current_length = 0

    if current_chunk:
        yield ' '.join(current_chunk)


# Function to answer questions using BERT
def answer_question(question, context, tokenizer, model):
    max_chunk_length = 400
    context_chunks = list(split_text(context, max_chunk_length, tokenizer))

    best_answer = ""
    best_score = float('-inf')

    for chunk in context_chunks:
        inputs = tokenizer.encode_plus(question, chunk, add_special_tokens=True, return_tensors="pt")

        if inputs['input_ids'].shape[1] > 512:
            continue

        input_ids = inputs["input_ids"]
        attention_mask = inputs["attention_mask"]

        with torch.no_grad():
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)

        answer_start_scores = outputs.start_logits
        answer_end_scores = outputs.end_logits

        answer_start = torch.argmax(answer_start_scores)
        answer_end = torch.argmax(answer_end_scores) + 1

        answer = tokenizer.convert_tokens_to_string(
            tokenizer.convert_ids_to_tokens(input_ids[0][answer_start:answer_end]))

        score = answer_start_scores[0, answer_start] + answer_end_scores[0, answer_end - 1]
        if score > best_score:
            best_score = score
            best_answer = answer

    return best_answer


if __name__ == "__main__":
    # Load pre-trained BERT model and tokenizer
    model_name = "bert-large-uncased-whole-word-masking-finetuned-squad"
    tokenizer = BertTokenizer.from_pretrained(model_name)
    model = BertForQuestionAnswering.from_pretrained(model_name)

    # Load the QA dataset
    with open("qa_dataset.json", "r") as f:
        qa_dataset = json.load(f)

    # Extract syllabus text
    syllabus_text = extract_text_from_pdf("syllabi/syllabus2.pdf")

    # Use the QA dataset to answer questions
    for qa_pair in qa_dataset:
        context = syllabus_text
        question = qa_pair["question"]
        expected_answer = qa_pair["answer"]

        answer = answer_question(question, context, tokenizer, model)
        print(f"Q: {question}")
        print(f"Expected A: {expected_answer}")
        print(f"Model A: {answer}\n")


"""

WORKING QUESTIONS AND ANSWERS THAT I KNOW OF

======================================================

Q: What is the title of this course
Expected A: ELECTROCARDIOGRAPH TECHNIQUE & APPLICATION
Model A: electrocardiograph technique & application

Q: What is the course schedule
Expected A: Classes are scheduled between 8:00 AM and 10:00 PM, weekdays (dependent upon day or
Model A: classes are scheduled between 8 : 00 am and 10 : 00 pm , weekdays

Q: what is the course length
Expected A: 24 lecture hours / 24 lab hours / 3.0 Quarter Credits
Model A: 24 lecture hours / 24 lab hours / 3 . 0 quarter credits

Q: what resources are required for this course
Expected A: Cohn, E. & Gilroy-Doohan, M. (2002): Flip and See ECG, 2nd Edition Saunders Elsevier Publishing.
Model A: [CLS]  (NOT THIS ONE)

Q: This course combines lecture instructions with lab application. Instructional strategies include lecture, demonstration,
Expected A: discussion, practical application, simulation and presentations.
Model A: [CLS]

Q: How much are quizzes worth in this course
Expected A: 20%
Model A: [CLS]

Q: How much are tests worth in this course
Expected A: 25%
Model A: [CLS]

Q: How much is the final exam worth in this class
Expected A: 25%
Model A: 25 % 69 & below f

Q: is attendance mandatory in this class
Expected A: Tardiness and/or absence from any part of a class/lab will constitute a partial absence.
Model A: [CLS]

Q: what are the assignments for week 1
Expected A: Class notes, participation in lab\nreview of syllabus
Model A: [CLS]

Q: What are the prerequisites for this course?
Expected A: AHC101 Introduction to Health Careers; BI0101 Anatomy & Physiology 1
Model A: ahc101 introduction to health careers

Q: What are the objectives of the course
Expected A: d
Model A: upon successful completion of this course , the student will be able to : 1 . define the key terms associated with electrocardiographs

Q: what is the overview of the course
Expected A: Acquiring a deeper understanding of the cardiovascular system and how it functions, students
Model A: acquiring a deeper understanding of the cardiovascular system and how it functions

Q: recognition of cardiac rhythm and response to emergency findings.Can make-up sessions be scheduled in this class
Expected A: Make-up sessions may be scheduled during hours other than the regularly-scheduled meeting times, including breaks
Model A: [CLS]
"""