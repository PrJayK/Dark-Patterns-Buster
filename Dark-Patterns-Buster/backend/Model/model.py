from sklearn.feature_extraction.text import TfidfVectorizer
import pandas as pd
from sklearn.model_selection import train_test_split
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
import numpy as np
from scipy import stats 
from sklearn.metrics import accuracy_score

vect = TfidfVectorizer(max_features = 100,lowercase=True)
rfc = RandomForestClassifier()
svc = SVC()

df = pd.read_csv('.\\Dark-Patterns-Buster\\Dark-Patterns-Buster\\backend\\Model\\dataset.tsv', sep="\t", encoding="utf-8")
X_train = df['text']
vect.fit_transform(X_train)

with open(".\\Dark-Patterns-Buster\\Dark-Patterns-Buster\\backend\\Model\\rfc.pkl","rb") as f:
    rfc = pickle.load(f)
with open(".\\Dark-Patterns-Buster\\Dark-Patterns-Buster\\backend\\Model\\svc.pkl","rb") as f:
    svc = pickle.load(f)


reverse_map = {i:j for i,j in  enumerate(df['Pattern Category'].unique())}


def ensemble(text):
  text = [i.lower() for i in text if not isinstance(i, (int, float))]
  if(len(text) == 0):
    text.append("a")
  text = vect.transform(text)
  results = [rfc.predict(text)[0],svc.predict(text)[0]]
  return reverse_map[stats.mode(results).mode]


data_df = pd.read_csv(".\\Dark-Patterns-Buster\\Dark-Patterns-Buster\\backend\\Model\\output.csv")
data_df['label'] = data_df['text'].apply(lambda x: ensemble([x]))
final_df = data_df.loc[data_df['label'] != "Not Dark Pattern"]
final_df.drop('label',inplace = True,axis = 1)
final_df.drop('text',inplace= True,axis = 1)

final_df.to_csv(".\\Dark-Patterns-Buster\\Dark-Patterns-Buster\\backend\\Model\\ids.csv",index = False)
