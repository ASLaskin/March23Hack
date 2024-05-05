import pdfplumber
import pandas as pd
import numpy as np
import torch
from transformers import BertForQuestionAnswering, BertTokenizer
import warnings
warnings.simplefilter("ignore")

def AI(question):
    file = "syllabus.pdf"
    all_text = ''
    with pdfplumber.open(file) as pdf:
        for pdf_page in pdf.pages:
            single_page_text = pdf_page.extract_text()
            all_text = all_text + single_page_text
    all_text = all_text.strip()

    context = ("Course Communication, Office Hours, and Code Review Policy 3. Use course slack or office hours for all course related communication. For any personal communication such as accommodations request, you can use emails, but we will not answer course related questions such as debugging requests on email. Note that we do not respond to Canvas messages as we prefer to keep all communications in one place. 4. We typically answer queries on Slack within 48 business hours. 5. Students should visit the course staff during scheduled office hours for help on projects or quizzes. Debugging requests for projects/quiz questions must first go through the TAs or peer mentors. This is strongly encouraged given we have a large class and several of you might have similar questions. If your problem is not fixed, then discuss with the instructor during their office hours. Debugging requests to the instructor as a direct message on Slack or an email will be ignored if you do not follow the above protocol.")

    weight_path = "kaporter/bert-base-uncased-finetuned-squad"
    tokenizer = BertTokenizer.from_pretrained(weight_path)
    model = BertForQuestionAnswering.from_pretrained(weight_path)

    input_ids = tokenizer.encode(question, context)
    tokens = tokenizer.convert_ids_to_tokens(input_ids)
    sep_idx = tokens.index('[SEP]')
    token_type_ids = [0 for i in range(sep_idx+1)] + [1 for i in range(sep_idx+1,len(tokens))]

    out = model(torch.tensor([input_ids]), token_type_ids=torch.tensor([token_type_ids]))

    start_logits, end_logits = out['start_logits'], out['end_logits']
    answer_start = torch.argmax(start_logits)
    answer_end = torch.argmax(end_logits)

    # Retrieve the answer tokens and convert them to a string with spaces and stop words included
    answer_tokens = tokens[answer_start:answer_end+1]
    answer = ' '.join([token for token in answer_tokens if token not in ['[CLS]', '[SEP]']])

    # Find the start and end positions of the answer in the original text
    start_pos = all_text.find(answer)
    end_pos = start_pos + len(answer)

    return all_text[start_pos:end_pos]

# Example usage
question = "what is the slack answer time?"
answer = AI(question)
print("Answer:", answer)
