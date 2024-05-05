import pdfplumber
import pandas as pd
import numpy as np
import torch
from transformers import BertForQuestionAnswering
from transformers import BertTokenizer
import warnings
warnings.simplefilter("ignore")

#pip install pandas pdfplumber numpy torch transformers warnings

#pdf = pdfplumber.open("C:/Users/danie/PycharmProjects/pythonProject2/COP3530.pdf")
def AI(question):
    file = "syllabus.pdf"
    #total_pages = len(pdf.pages)
    all_text = ''  # new line
    with pdfplumber.open(file) as pdf:
        # page = pdf.pages[0] - comment out or remove line
        # text = page.extract_text() - comment out or remove line
        for pdf_page in pdf.pages:
            single_page_text = pdf_page.extract_text()
            #print(single_page_text)
            # separate each page's text with newline
            all_text = all_text + single_page_text
        #print(all_text)


    all_text=all_text.strip()


    # question = ("what is slack answer time?")
    # context = "BERT-large is really big... it has 24-layers and an embedding size of 1,024, for a total of 340M parameters! Altogether it is 1.34GB, so expect it to take a couple minutes to download to your Colab instance."
    context="Course Communication, Office Hours, and Code Review Policy 3. Use course slack or office hours for all course related communication. For any personal communication such as accommodations request, you can use emails, but we will not answer course related questions such as debugging requests on email. Note that we do not respond to Canvas messages as we prefer to keep all communications in one place. 4. We typically answer queries on Slack within 48 business hours. 5. Students should visit the course staff during scheduled office hours for help on projects or quizzes. Debugging requests for projects/quiz questions must first go through the TAs or peer mentors. This is strongly encouraged given we have a large class and several of you might have similar questions. If your problem is not fixed, then discuss with the instructor during their office hours. Debugging requests to the instructor as a direct message on Slack or an email will be ignored if you do not follow the above protocol."

    weight_path = "kaporter/bert-base-uncased-finetuned-squad"
    # loading tokenizer
    tokenizer = BertTokenizer.from_pretrained(weight_path)
    #loading the model
    model = BertForQuestionAnswering.from_pretrained(weight_path)

    input_ids = tokenizer.encode(question, context)
    print(f'We have about {len(input_ids)} tokens generated')

    tokens = tokenizer.convert_ids_to_tokens(input_ids)
    print(" ")
    print('Some examples of token-input_id pairs:')

    for i, (token, inp_id) in enumerate(zip(tokens, input_ids)):
        print(token, ":", inp_id)

    sep_idx = tokens.index('[SEP]')

    # we will provide including [SEP] token which seperates question from context and 1 for rest.
    token_type_ids = [0 for i in range(sep_idx+1)] + [1 for i in range(sep_idx+1,len(tokens))]
    print(token_type_ids)

    # Run our example through the model.
    out = model(torch.tensor([input_ids]), # The tokens representing our input text.
                    token_type_ids=torch.tensor([token_type_ids]))

    start_logits,end_logits = out['start_logits'],out['end_logits']
    # Find the tokens with the highest `start` and `end` scores.
    answer_start = torch.argmax(start_logits)
    answer_end = torch.argmax(end_logits)

    ans = ''.join(tokens[answer_start:answer_end])
    return ans