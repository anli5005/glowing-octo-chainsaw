import email
from bs4 import BeautifulSoup
import re

parser = email.parser.Parser()

def parse_email(path):
    handle = open(path, "r")
    msg = parser.parse(handle)
    handle.close()

    subject = None
    try:
        subject = handle["subject"]
    except:
        subject = None
    
    text = None
    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            text = part.get_payload(decode=True).decode(part.get_content_charset("utf-8")).split("________________________________")[0]
            try:
                text = BeautifulSoup(text).get_text()
            except:
                print("Unable to parse HTML.")
            
    if text is not None:
        text = re.sub(r"=(\r?\n)?", "", text.replace("=92", "'")).strip()
    
    return subject, text