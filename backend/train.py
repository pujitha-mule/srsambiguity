import pandas as pd
import pickle
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

data = pd.read_csv("dataset.csv")

X = data["requirement"]
y = data["label"]

vectorizer = TfidfVectorizer()
Xv = vectorizer.fit_transform(X)

model = LogisticRegression()
model.fit(Xv, y)

pickle.dump(model, open("model.pkl","wb"))
pickle.dump(vectorizer, open("vectorizer.pkl","wb"))

print("Model trained")

